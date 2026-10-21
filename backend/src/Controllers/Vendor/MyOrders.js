import mongoose from "mongoose";
import orderModel from "../../models/user/MyOrdersModel.js";
import shipOrder from "../../models/Shiprocket/ShipOrder.js";
import {
  assignShiprocketCourier,
  createShiprocketOrderFromOrder,
  generateShiprocketPickup,
  getAvailableShiprocketCouriers,
  getShiprocketOrderByReference,
  getShiprocketTracking,
} from "../../Services/ShipRocket.js";
import {
  refreshMarketplaceOrderStatus,
  updateTrackingSnapshot,
} from "../../Services/MarketplaceShippingStatus.js";
import {
  calculateShipmentParcel,
  calculateVendorMerchandiseValue,
} from "../../Services/ShipmentParcel.js";
import {
  getEligibleOrderItemsForShipment,
  isStaleCreatingReservation,
  reconcileShipmentReservation,
  saveShipmentReservationForPaidOrder,
  validateShiprocketCourierAssignment,
  validateShiprocketPickupResponse,
  SHIPROCKET_CREATING_STALE_AFTER_MS,
} from "../../Services/ShiprocketShipmentSafety.js";

const findVendorShipment = (shipOrderId, vendorId) => {
  const query = { vendorId };

  if (mongoose.Types.ObjectId.isValid(shipOrderId)) {
    query.$or = [
      { _id: shipOrderId },
      { orderId: shipOrderId },
      { shiprocketShipmentId: String(shipOrderId) },
    ];
  } else {
    query.shiprocketShipmentId = String(shipOrderId);
  }

  return shipOrder.findOne(query);
};

const getVendorOrderStatus = (shipment) => {
  if (!shipment) return "Pending";

  switch (shipment.status) {
    case "AWB_ASSIGNED":
      return "Confirmed";
    case "NEW":
      return "Awaiting AWB";
    case "PROCESSING":
      return "Processing";
    case "PICKUP_REQUESTED":
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "SHIPPED":
      return "Shipped";
    default:
      return shipment.awbCode ? "Confirmed" : "Awaiting AWB";
  }
};

const serializeOrderForVendor = (order, vendorId) => {
  const orderData = order.toObject ? order.toObject() : { ...order };
  const vendorIdString = vendorId.toString();
  const items = (orderData.items || []).filter(
    (item) => item.vendorId?.toString() === vendorIdString,
  );
  const quote = (orderData.vendorShippingQuotes || []).find(
    (entry) => entry.vendorId?.toString() === vendorIdString,
  );
  const subtotalAmount = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const shippingAmount = Number(quote?.shippingAmount || 0);

  return {
    ...orderData,
    items,
    totalAmount: subtotalAmount,
    subtotalAmount,
    shippingAmount,
    finalTotal: subtotalAmount + shippingAmount,
    shippingCourierCompanyId: quote?.courierCompanyId || "",
    shippingCourierName: quote?.courierName || "",
    shippingPickupPostcode: quote?.pickupPostcode || "",
    shippingWeight: quote?.weight || 0,
    estimatedDelivery: quote?.estimatedDelivery || "",
    vendorShippingQuotes: quote ? [quote] : [],
  };
};

export const getMyOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const orders = await orderModel
      .find({
        "items.vendorId": vendorId,
      })
      .populate("items.productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const shipments = await shipOrder.find({
      vendorId,
      orderId: { $in: orders.map((order) => order._id) },
    });
    const shipmentByOrderId = new Map(
      shipments.map((shipment) => [shipment.orderId.toString(), shipment]),
    );
    const ordersWithShipments = orders.map((order) => {
      const shipment = shipmentByOrderId.get(order._id.toString()) || null;
      return {
        ...serializeOrderForVendor(order, vendorId),
        vendorStatus: getVendorOrderStatus(shipment),
        shipment,
      };
    });

    return res.status(200).json({
      message: "Vendor orders fetched successfully",
      orders: ordersWithShipments,
    });
  } catch (error) {
    console.log("Get Vendor Orders Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const acceptOrder = async (req, res) => {
  let shiprocketStep = "prepare shipment";
  let shipmentReservation;

  try {
    const { orderId } = req.params;

    const vendorId = req.vendor._id;

    const existingOrder = await orderModel
      .findById(orderId)
      .populate("items.productId")
      .populate("userId", "name email phone");

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    let vendorItems;
    try {
      vendorItems = getEligibleOrderItemsForShipment(existingOrder, vendorId);
    } catch (error) {
      return res.status(error.status || 400).json({ message: error.message });
    }

    const existingVendorShipment = await shipOrder.findOne({
      orderId: existingOrder._id,
      vendorId,
    });
    if (existingVendorShipment) {
      if (existingVendorShipment.status === "CREATING" ||
          existingVendorShipment.status === "CREATION_UNKNOWN") {
        return res.status(409).json({
          success: false,
          message: "Shipment creation is already reserved or needs reconciliation. It will not be submitted again automatically.",
        });
      }
      return res.status(200).json({
        success: true,
        message: existingVendorShipment.awbCode
          ? "This vendor shipment already exists"
          : "Shiprocket order already exists; continue with courier and AWB assignment",
        order: serializeOrderForVendor(existingOrder, vendorId),
        shipment: existingVendorShipment,
      });
    }

    const pickupAddress = req.vendor.pickupAddress;
    const pickupPostcode = String(pickupAddress?.pincode || "").trim();
    const pickupLocationName = String(
      pickupAddress?.shiprocketLocationName || "",
    ).trim();
    const deliveryPostcode = String(
      existingOrder.shippingAddress?.pincode || "",
    ).trim();

    if (
      !pickupLocationName ||
      !pickupAddress?.address ||
      !pickupAddress?.city ||
      !pickupAddress?.state ||
      !/^\d{6}$/.test(pickupPostcode)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Save a complete vendor pickup address with a valid six-digit pincode and registered Shiprocket pickup location before accepting this order",
      });
    }

    if (!/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        success: false,
        message:
          "The customer's shipping address must have a valid six-digit pincode",
      });
    }

    const vendorShippingQuote = (existingOrder.vendorShippingQuotes || []).find(
      (quote) => quote.vendorId.toString() === vendorId.toString(),
    );
    let parcel;
    try {
      parcel = calculateShipmentParcel(vendorItems);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    const courierCompanyId = String(
      vendorShippingQuote?.courierCompanyId ||
        existingOrder.shippingCourierCompanyId ||
        "",
    ).trim();

    if (!/^\d+$/.test(courierCompanyId)) {
      return res.status(400).json({
        message: "The order does not have a configured Shiprocket courier",
      });
    }

    // Reserve the (order, vendor) shipment before the external create call.
    // Shiprocket rejects a reused merchant order_id, so an ambiguous timeout
    // must never cause an automatic second create request.
    shipmentReservation = new shipOrder({
      orderId: existingOrder._id,
      userId: existingOrder.userId,
      vendorId,
      pickupLocationName,
      pickupPostcode,
      deliveryPostcode,
      courierCompanyId,
      courierName: vendorShippingQuote?.courierName || "",
      ...parcel,
      estimatedShippingCost: vendorShippingQuote?.estimatedShippingCost ?? vendorShippingQuote?.shippingAmount ?? null,
      status: "CREATING",
    });
    try {
      await saveShipmentReservationForPaidOrder({
        order: existingOrder,
        vendorId,
        reservation: shipmentReservation,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "A shipment for this vendor order has already been reserved",
        });
      }
      throw error;
    }

    shiprocketStep = "create Shiprocket shipment";
    const shiprocketOrder = await createShiprocketOrderFromOrder(
      {
        ...existingOrder.toObject(),
        items: vendorItems,
      },
      pickupAddress,
      vendorId,
    );
    const shiprocketOrderId = String(shiprocketOrder?.order_id || "").trim();
    const shiprocketShipmentId = String(
      shiprocketOrder?.shipment_id || "",
    ).trim();

    if (!shiprocketOrderId || !shiprocketShipmentId) {
      shiprocketStep = "validate Shiprocket create-order response";
      const rawResponse = shiprocketOrder?.rawResponse ?? shiprocketOrder;
      const shiprocketError =
        rawResponse?.errors ||
        rawResponse?.error ||
        rawResponse?.data?.errors ||
        rawResponse?.data?.error ||
        rawResponse?.data?.message ||
        rawResponse?.message;
      const errorDetails =
        typeof shiprocketError === "string"
          ? shiprocketError
          : shiprocketError
            ? JSON.stringify(shiprocketError)
            : "";

      console.log("Shiprocket create-order response is missing required IDs", {
        hasOrderId: Boolean(shiprocketOrderId),
        hasShipmentId: Boolean(shiprocketShipmentId),
        responseData: rawResponse,
      });
      shipmentReservation.status = "CREATION_UNKNOWN";
      await shipmentReservation.save();
      return res.status(502).json({
        success: false,
        message: errorDetails
          ? `Shiprocket order creation failed: ${errorDetails}`
          : "Shiprocket did not return the required order and shipment IDs; the shipment could not be saved locally.",
        shiprocketResponse: rawResponse,
      });
    }

    const newShipOrder = shipmentReservation;
    newShipOrder.shiprocketOrderId = shiprocketOrderId;
    newShipOrder.shiprocketShipmentId = shiprocketShipmentId;
    newShipOrder.awbCode = shiprocketOrder.awb_code ? String(shiprocketOrder.awb_code) : "";
    newShipOrder.courierCompanyId = String(
      shiprocketOrder.courier_company_id || courierCompanyId,
    );
    newShipOrder.courierName = shiprocketOrder.courier_name || vendorShippingQuote?.courierName || "";
    const actualShippingCost = Number(
      shiprocketOrder.freight_charge ?? shiprocketOrder.shipping_charge ?? shiprocketOrder.shipping_cost,
    );
    if (Number.isFinite(actualShippingCost) && actualShippingCost >= 0) {
      newShipOrder.actualShippingCost = actualShippingCost;
    }
    newShipOrder.status = shiprocketOrder.awb_code ? "AWB_ASSIGNED" : "NEW";
    await newShipOrder.save();

    let assignmentData = shiprocketOrder;

    if (!shiprocketOrder.awb_code) {
      shiprocketStep = "assign Shiprocket courier and AWB";
      const assignment = await assignShiprocketCourier(
        shiprocketShipmentId,
        Number(courierCompanyId),
        vendorId,
      );
      try {
        assignmentData = validateShiprocketCourierAssignment(
          assignment,
        );
      } catch (error) {
        return res.status(502).json({ success: false, message: error.message });
      }
    }

    const awbCode = assignmentData.awb_code || shiprocketOrder.awb_code;
    const assignedCourierCompanyId = String(
      assignmentData.courier_company_id ||
        shiprocketOrder.courier_company_id ||
        courierCompanyId,
    );

    if (!awbCode) {
      return res.status(502).json({
        success: false,
        message: "Shiprocket could not assign an AWB",
      });
    }

    newShipOrder.awbCode = String(awbCode);
    newShipOrder.courierCompanyId = assignedCourierCompanyId;
    newShipOrder.courierName =
      assignmentData.courier_name ||
      shiprocketOrder.courier_name ||
      vendorShippingQuote?.courierName ||
      existingOrder.shippingCourierName ||
      "";
    newShipOrder.status = "AWB_ASSIGNED";
    const assignedShippingCost = Number(
      assignmentData.freight_charge ?? assignmentData.shipping_charge ?? assignmentData.shipping_cost,
    );
    if (Number.isFinite(assignedShippingCost) && assignedShippingCost >= 0) {
      newShipOrder.actualShippingCost = assignedShippingCost;
    }
    await newShipOrder.save();

    await refreshMarketplaceOrderStatus(existingOrder);

    return res.status(200).json({
      success: true,
      message: "Order accepted and Shiprocket shipment created",
      order: serializeOrderForVendor(existingOrder, vendorId),
      shipment: newShipOrder,
    });
  } catch (error) {
    if (shipmentReservation && shipmentReservation.status === "CREATING") {
      shipmentReservation.status = "CREATION_UNKNOWN";
      await shipmentReservation.save().catch(() => {});
    }
    console.log(
      `Accept Order Error during ${shiprocketStep}:`,
      error.response?.data || error.message,
    );

    return res.status(error.response ? 502 : 500).json({
      success: false,
      message:
        error.response?.status === 403
          ? `Shiprocket denied permission during ${shiprocketStep}. Check the Shiprocket account/API access used by this backend.`
          : "Failed to accept order",
      error: error.response?.data || error.message,
    });
  }
};

/** Reconcile an ambiguous Shiprocket create timeout using read-only order
 * lookup. This action never resubmits shipment creation.
 */
export const reconcileUnknownShipment = async (req, res) => {
  try {
    const shipment = await findVendorShipment(req.params.shipOrderId, req.vendor._id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    if (shipment.status === "CREATING" && !isStaleCreatingReservation(shipment)) {
      return res.status(409).json({
        message: `Shipment creation is still in progress. Retry reconciliation after ${Math.ceil(SHIPROCKET_CREATING_STALE_AFTER_MS / 60000)} minutes.`,
      });
    }
    if (shipment.status !== "CREATION_UNKNOWN" && shipment.status !== "CREATING") {
      return res.status(409).json({ message: "Only unresolved shipment creation can be reconciled" });
    }

    const order = await orderModel.findById(shipment.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const recovery = await reconcileShipmentReservation({
      Shipment: shipOrder,
      shipment,
      vendorId: req.vendor._id,
      orderReference: String(order._id),
      lookupOrder: getShiprocketOrderByReference,
    });
    if (recovery.state === "still_creating") {
      return res.status(409).json({
        success: false,
        message: "Shipment creation is still in progress. Reconciliation can be retried after the reservation is stale.",
      });
    }
    if (recovery.state === "found" || recovery.state === "already_changed") {
      const recoveredShipment = recovery.shipment;
      if (recovery.state === "already_changed" &&
          (!recoveredShipment || ["CREATING", "CREATION_UNKNOWN"].includes(recoveredShipment.status))) {
        return res.status(409).json({
          success: false,
          unresolved: true,
          message: "Shipment reconciliation is still unresolved. Check Shiprocket manually; do not submit another shipment.",
          shipment: recoveredShipment,
        });
      }
      if (recoveredShipment?.awbCode) await refreshMarketplaceOrderStatus(order);
      return res.status(200).json({
        success: true,
        message: recoveredShipment?.awbCode
          ? "Existing Shiprocket shipment reconciled with its AWB"
          : "Existing Shiprocket shipment found; continue with courier and AWB assignment",
        shipment: recoveredShipment,
      });
    }
    return res.status(recovery.lookupFailed ? 503 : 409).json({
      success: false,
      unresolved: true,
      message: recovery.lookupFailed
        ? "Shiprocket lookup could not confirm whether shipment creation succeeded. The reservation remains unresolved; do not create another shipment. Retry reconciliation or resolve it manually in Shiprocket."
        : "No unique exact Shiprocket order reference was found. The reservation remains unresolved; do not create another shipment. Retry reconciliation or resolve it manually in Shiprocket.",
      shipment: recovery.shipment,
    });
  } catch (error) {
    console.error("Shiprocket reservation reconciliation failed", {
      status: error.response?.status,
      code: error.code,
    });
    return res.status(error.response ? 502 : 500).json({
      success: false,
      message: "Could not reconcile the Shiprocket reservation. No new shipment was submitted.",
    });
  }
};

export const getAvailableCouriers = async (req, res) => {
  try {
    const { shipOrderId } = req.params;
    const vendorId = req.vendor._id;

    const shipment = await findVendorShipment(shipOrderId, vendorId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const order = await orderModel.findById(shipment.orderId).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let vendorItems;
    try {
      vendorItems = getEligibleOrderItemsForShipment(order, vendorId);
    } catch (error) {
      return res.status(error.status || 400).json({ message: error.message });
    }

    const pickupPostcode = String(
      shipment.pickupPostcode || req.vendor.pickupAddress?.pincode || "",
    ).trim();
    const deliveryPostcode = String(
      order.shippingAddress?.pincode || "",
    ).trim();

    if (!/^\d{6}$/.test(pickupPostcode)) {
      return res.status(400).json({
        message:
          "Vendor pickup pincode is missing or invalid; save a valid pickup address in your profile",
      });
    }

    if (!/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        message: "The order does not have a valid delivery postcode",
      });
    }

    let parcel;
    try {
      parcel = calculateShipmentParcel(vendorItems);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    const shiprocketResponse = await getAvailableShiprocketCouriers({
      vendorId,
      shipmentId: shipment.shiprocketShipmentId,
      pickupPostcode,
      deliveryPostcode,
      ...parcel,
      cod: order.paymentMethod?.toLowerCase() === "cod" ? 1 : 0,
      declaredValue: calculateVendorMerchandiseValue(order, vendorId),
    });

    const couriers =
      shiprocketResponse.data?.available_courier_companies ||
      shiprocketResponse.available_courier_companies ||
      [];
    const couriersToReturn = [...couriers].sort(
      (left, right) =>
        Number(left.rate ?? left.freight_charge ?? Infinity) -
        Number(right.rate ?? right.freight_charge ?? Infinity),
    );

    return res.status(200).json({
      success: true,
      couriers: couriersToReturn.map((courier) => ({
        courierCompanyId: courier.courier_company_id,
        courierName: courier.courier_name,
        rate: courier.rate ?? courier.freight_charge ?? null,
        estimatedDelivery:
          courier.etd || courier.estimated_delivery_days || null,
        rating: courier.rating ?? null,
        pickupPerformance: courier.pickup_performance ?? null,
        deliveryPerformance: courier.delivery_performance ?? null,
        codAvailable: Number(courier.cod) === 1,
        zone: courier.zone || null,
      })),
    });
  } catch (error) {
    console.log(
      "Get Available Couriers Error:",
      error.response?.data || error.message,
    );

    return res.status(error.response ? 502 : 500).json({
      message: "Could not get available couriers",
      error: error.response?.data || error.message,
    });
  }
};

export const assignCourier = async (req, res) => {
  try {
    const { shipOrderId } = req.params;
    const shipment = await findVendorShipment(shipOrderId, req.vendor._id);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const order = await orderModel.findById(shipment.orderId).populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    let vendorItems;
    try {
      vendorItems = getEligibleOrderItemsForShipment(order, req.vendor._id);
    } catch (error) {
      return res.status(error.status || 400).json({ message: error.message });
    }

    if (shipment.awbCode) {
      return res.status(200).json({
        success: true,
        message: "Courier and AWB are already assigned",
        shipment,
      });
    }

    const pickupPostcode = String(
      shipment.pickupPostcode || req.vendor.pickupAddress?.pincode || "",
    ).trim();
    const deliveryPostcode = String(
      order.shippingAddress?.pincode || "",
    ).trim();
    if (!/^\d{6}$/.test(pickupPostcode) || !/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        message:
          "Vendor pickup and customer delivery addresses must both have valid six-digit pincodes",
      });
    }

    let parcel;
    try {
      parcel = calculateShipmentParcel(vendorItems);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    const shiprocketResponse = await getAvailableShiprocketCouriers({
      vendorId: req.vendor._id,
      shipmentId: shipment.shiprocketShipmentId,
      pickupPostcode,
      deliveryPostcode,
      ...parcel,
      cod: order.paymentMethod?.toLowerCase() === "cod" ? 1 : 0,
      declaredValue: calculateVendorMerchandiseValue(order, req.vendor._id),
    });
    const availableCouriers =
      shiprocketResponse.data?.available_courier_companies ||
      shiprocketResponse.available_courier_companies ||
      [];
    const requestedCourierCompanyId = String(req.body?.courierCompanyId || "");
    const requestedIsAvailable = availableCouriers.some(
      (courier) =>
        String(courier.courier_company_id) === requestedCourierCompanyId,
    );

    if (!requestedIsAvailable) {
      return res.status(400).json({
        message:
          "Select a courier available for this pickup and delivery route",
      });
    }

    const assignment = await assignShiprocketCourier(
      shipment.shiprocketShipmentId,
      Number(requestedCourierCompanyId),
      req.vendor._id,
    );
    let assignmentData;
    try {
      assignmentData = validateShiprocketCourierAssignment(
        assignment,
      );
    } catch (error) {
      return res.status(502).json({
        message: error.message,
      });
    }

    shipment.awbCode = String(assignmentData.awb_code);
    shipment.courierCompanyId = String(assignmentData.courier_company_id);
    shipment.courierName = assignmentData.courier_name || "";
    shipment.status = "AWB_ASSIGNED";
    await shipment.save();
    await refreshMarketplaceOrderStatus(order);

    return res.status(200).json({
      success: true,
      message: "Courier assigned and AWB generated",
      shipment,
    });
  } catch (error) {
    const shiprocketResponse = error.response?.data;
    const shiprocketDetails =
      shiprocketResponse?.message ||
      shiprocketResponse?.errors ||
      shiprocketResponse?.details ||
      shiprocketResponse?.error;
    const errorMessage =
      typeof shiprocketDetails === "string"
        ? shiprocketDetails
        : shiprocketDetails
          ? JSON.stringify(shiprocketDetails)
          : error.message;

    console.log("Assign Courier Error", {
      httpStatus: error.response?.status,
      responseBody: shiprocketResponse,
      message: error.message,
    });

    return res.status(error.response ? 502 : 500).json({
      message: error.response
        ? `Shiprocket AWB assignment failed: ${errorMessage}`
        : "Could not assign courier",
      httpStatus: error.response?.status,
      shiprocketResponse,
      error: shiprocketResponse || error.message,
    });
  }
};

export const markOrderProcessing = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    try {
      getEligibleOrderItemsForShipment(order, req.vendor._id);
    } catch (error) {
      return res.status(error.status || 400).json({ message: error.message });
    }

    const shipment = await shipOrder.findOne({
      orderId: order._id,
      vendorId: req.vendor._id,
    });
    if (!shipment || !shipment.awbCode || shipment.status !== "AWB_ASSIGNED") {
      return res.status(400).json({
        message:
          "Accept this vendor order and assign an AWB before processing it",
      });
    }

    shipment.status = "PROCESSING";
    await shipment.save();
    await refreshMarketplaceOrderStatus(order);

    return res.status(200).json({
      success: true,
      message: "Order marked as Processing",
      order: serializeOrderForVendor(order, req.vendor._id),
    });
  } catch (error) {
    console.log("Mark Order Processing Error:", error.message);

    return res.status(500).json({
      message: "Could not update order status",
      error: error.message,
    });
  }
};

export const shipVendorOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    try {
      getEligibleOrderItemsForShipment(order, req.vendor._id);
    } catch (error) {
      return res.status(error.status || 400).json({ message: error.message });
    }

    const shipment = await shipOrder.findOne({
      orderId: order._id,
      vendorId: req.vendor._id,
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (!shipment.awbCode || !shipment.courierCompanyId) {
      return res.status(400).json({
        message: "Assign a courier and AWB before shipping this order",
      });
    }

    if (shipment.status !== "PROCESSING") {
      return res.status(400).json({
        message: "Mark this vendor's order as Processing before shipping it",
      });
    }

    const pickupResponse = await generateShiprocketPickup(
      shipment.shiprocketShipmentId,
      req.vendor._id,
    );

    if (!validateShiprocketPickupResponse(pickupResponse)) {
      return res.status(502).json({
        message: "Shiprocket did not confirm a scheduled pickup",
        error: pickupResponse,
      });
    }

    shipment.status = "PICKUP_REQUESTED";
    await shipment.save();
    await refreshMarketplaceOrderStatus(order);

    return res.status(200).json({
      success: true,
      message: "Order shipped and pickup requested",
      order: serializeOrderForVendor(order, req.vendor._id),
      shipment,
      shiprocket: pickupResponse,
    });
  } catch (error) {
    console.log("Ship Order Error:", error.response?.data || error.message);

    return res.status(error.response ? 502 : 500).json({
      message: "Could not ship order",
      error: error.response?.data || error.message,
    });
  }
};

export const getVendorShipmentTracking = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = mongoose.Types.ObjectId.isValid(shipmentId)
      ? await shipOrder.findOne({
          vendorId: req.vendor._id,
          $or: [
            { _id: shipmentId },
            { orderId: shipmentId },
            { shiprocketShipmentId: String(shipmentId) },
          ],
        })
      : await shipOrder.findOne({
          vendorId: req.vendor._id,
          shiprocketShipmentId: String(shipmentId),
        });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const trackingResponse = await getShiprocketTracking({
      awbCode: shipment.awbCode,
      shipmentId: shipment.shiprocketShipmentId,
      vendorId: req.vendor._id,
    });
    const trackingData =
      trackingResponse.tracking_data ||
      trackingResponse.data?.tracking_data ||
      trackingResponse;
    await updateTrackingSnapshot(shipment, trackingData);
    const latestTracking = trackingData.shipment_track?.[0] || {};

    return res.status(200).json({
      success: true,
      shipment,
      tracking: {
        ...trackingData,
        currentStatus:
          latestTracking.current_status ||
          trackingData.shipment_status ||
          shipment.status,
        courierName:
          latestTracking.courier_name ||
          trackingData.courier_name ||
          shipment.courierName,
        awbCode:
          latestTracking.awb_code || trackingData.awb_code || shipment.awbCode,
        history:
          trackingData.shipment_track_activities ||
          latestTracking.shipment_track_activities ||
          [],
        estimatedDelivery:
          latestTracking.etd ||
          trackingData.etd ||
          trackingData.estimated_delivery_date ||
          null,
      },
    });
  } catch (error) {
    console.log(
      "Get Vendor Shipment Tracking Error:",
      error.response?.data || error.message,
    );

    return res.status(error.response ? 502 : 500).json({
      message: "Could not get shipment tracking",
      error: error.response?.data || error.message,
    });
  }
};
