import mongoose from "mongoose";
import orderModel from "../../models/user/MyOrdersModel.js";
import shipOrder from "../../models/Shiprocket/ShipOrder.js";
import {
  assignShiprocketCourier,
  createShiprocketOrderFromOrder,
  generateShiprocketPickup,
  getAvailableShiprocketCouriers,
  getShiprocketTracking,
} from "../../Services/ShipRocket.js";

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
    default:
      return shipment.awbCode ? "Confirmed" : "Awaiting AWB";
  }
};

const refreshMarketplaceOrderStatus = async (order) => {
  const vendorIds = [
    ...new Set(order.items.map((item) => item.vendorId.toString())),
  ];
  const shipments = await shipOrder.find({ orderId: order._id });
  const shipmentByVendorId = new Map(
    shipments.map((shipment) => [shipment.vendorId.toString(), shipment]),
  );
  const statusStages = {
    Pending: 0,
    "Awaiting AWB": 0,
    Confirmed: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
  };
  const stageStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
  ];
  const vendorStages = vendorIds.map((vendorId) =>
    statusStages[getVendorOrderStatus(shipmentByVendorId.get(vendorId))],
  );

  order.status = stageStatuses[
    vendorStages.length ? Math.min(...vendorStages) : 0
  ];
  await order.save();
};

export const getMyOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const orders = await orderModel
      .find({
        "items.vendorId": vendorId,
      })
      .populate("items.productId")
      .populate("userId")
      .sort({ createdAt: -1 });
    const shipments = await shipOrder.find({
      vendorId,
      orderId: { $in: orders.map((order) => order._id) },
    });
    const shipmentByOrderId = new Map(
      shipments.map((shipment) => [shipment.orderId.toString(), shipment])
    );
    const ordersWithShipments = orders.map((order) => {
      const shipment = shipmentByOrderId.get(order._id.toString()) || null;
      return {
        ...order.toObject(),
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

  try {
    const { orderId } = req.params;

    const vendorId = req.vendor._id;

    const existingOrder = await orderModel
      .findById(orderId)
      .populate("items.productId")
      .populate("userId");

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const vendorItems = existingOrder.items.filter(
      (item) => item.vendorId.toString() === vendorId.toString()
    );

    if (vendorItems.length === 0) {
      return res.status(403).json({
        message: "You are not authorized to accept this order",
      });
    }

    if (existingOrder.status === "Cancelled") {
      return res.status(400).json({
        message: "Order cannot be accepted",
      });
    }

    const existingVendorShipment = await shipOrder.findOne({
      orderId: existingOrder._id,
      vendorId,
    });
    if (existingVendorShipment) {
      return res.status(400).json({
        message: "This vendor has already accepted the order",
      });
    }

    const pickupAddress = req.vendor.pickupAddress;
    const pickupPostcode = String(pickupAddress?.pincode || "").trim();
    const pickupLocationName = String(
      pickupAddress?.shiprocketLocationName || ""
    ).trim();
    const deliveryPostcode = String(
      existingOrder.shippingAddress?.pincode || ""
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
        message: "Save a complete vendor pickup address with a valid six-digit pincode and registered Shiprocket pickup location before accepting this order",
      });
    }

    if (!/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        success: false,
        message: "The customer's shipping address must have a valid six-digit pincode",
      });
    }

    const vendorShippingQuote = (existingOrder.vendorShippingQuotes || []).find(
      (quote) => quote.vendorId.toString() === vendorId.toString()
    );
    const courierCompanyId = String(
      vendorShippingQuote?.courierCompanyId ||
        existingOrder.shippingCourierCompanyId ||
        ""
    ).trim();

    if (!/^\d+$/.test(courierCompanyId)) {
      return res.status(400).json({
        message: "The order does not have a configured Shiprocket courier",
      });
    }

    shiprocketStep = "create Shiprocket shipment";
    const shiprocketOrder = await createShiprocketOrderFromOrder({
      ...existingOrder.toObject(),
      items: vendorItems,
    }, pickupAddress);
    const shiprocketOrderId = String(shiprocketOrder?.order_id || "").trim();
    const shiprocketShipmentId = String(shiprocketOrder?.shipment_id || "").trim();

    if (!shiprocketOrderId || !shiprocketShipmentId) {
      shiprocketStep = "validate Shiprocket create-order response";
      console.log("Shiprocket create-order response is missing required IDs", {
        hasOrderId: Boolean(shiprocketOrderId),
        hasShipmentId: Boolean(shiprocketShipmentId),
        responseKeys: Object.keys(shiprocketOrder || {}),
      });
      return res.status(502).json({
        success: false,
        message: "Shiprocket did not return the required order and shipment IDs; the shipment could not be saved locally.",
      });
    }

    const newShipOrder = await shipOrder.create({
      orderId: existingOrder._id,
      userId: existingOrder.userId,
      vendorId,
      shiprocketOrderId,
      shiprocketShipmentId,
      awbCode: shiprocketOrder.awb_code
        ? String(shiprocketOrder.awb_code)
        : "",
      courierCompanyId: String(
        shiprocketOrder.courier_company_id || courierCompanyId
      ),
      courierName:
        shiprocketOrder.courier_name || vendorShippingQuote?.courierName || "",
      pickupLocationName,
      pickupPostcode,
      deliveryPostcode,
      status: shiprocketOrder.awb_code ? "AWB_ASSIGNED" : "NEW",
    });

    let assignmentData = shiprocketOrder;

    if (!shiprocketOrder.awb_code) {
      shiprocketStep = "assign Shiprocket courier and AWB";
      const assignment = await assignShiprocketCourier(
        shiprocketShipmentId,
        Number(courierCompanyId)
      );
      assignmentData =
        assignment.response?.data ||
        assignment.data ||
        assignment.response ||
        assignment;
    }

    const awbCode = assignmentData.awb_code || shiprocketOrder.awb_code;
    const assignedCourierCompanyId = String(
      assignmentData.courier_company_id ||
        shiprocketOrder.courier_company_id ||
        courierCompanyId
    );

    if (!awbCode || assignedCourierCompanyId !== courierCompanyId) {
      return res.status(502).json({
        success: false,
        message: "Shiprocket could not assign the configured courier and AWB",
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
    await newShipOrder.save();

    await refreshMarketplaceOrderStatus(existingOrder);

    return res.status(200).json({
      success: true,
      message: "Order accepted and Shiprocket shipment created",
      order: existingOrder,
      shipment: newShipOrder,
    });
  } catch (error) {
    console.log(
      `Accept Order Error during ${shiprocketStep}:`,
      error.response?.data || error.message,
    );

    return res.status(error.response ? 502 : 500).json({
      success: false,
      message: error.response?.status === 403
        ? `Shiprocket denied permission during ${shiprocketStep}. Check the Shiprocket account/API access used by this backend.`
        : "Failed to accept order",
      error: error.response?.data || error.message,
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

    const order = await orderModel.findById(shipment.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pickupPostcode = String(
      shipment.pickupPostcode || req.vendor.pickupAddress?.pincode || ""
    ).trim();
    const deliveryPostcode = String(order.shippingAddress?.pincode || "").trim();

    if (!/^\d{6}$/.test(pickupPostcode)) {
      return res.status(400).json({
        message: "Vendor pickup pincode is missing or invalid; save a valid pickup address in your profile",
      });
    }

    if (!/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        message: "The order does not have a valid delivery postcode",
      });
    }

    const shiprocketResponse = await getAvailableShiprocketCouriers({
      shipmentId: shipment.shiprocketShipmentId,
      pickupPostcode,
      deliveryPostcode,
      weight: 0.5,
      cod: order.paymentMethod?.toLowerCase() === "cod" ? 1 : 0,
      declaredValue: order.totalAmount,
    });

    const couriers =
      shiprocketResponse.data?.available_courier_companies ||
      shiprocketResponse.available_courier_companies ||
      [];
    const vendorQuote = (order.vendorShippingQuotes || []).find(
      (quote) => quote.vendorId.toString() === vendorId.toString()
    );
    const preferredCourierCompanyId = String(
      shipment.courierCompanyId ||
        vendorQuote?.courierCompanyId ||
        process.env.SHIPROCKET_COURIER_ID ||
        ""
    );
    const preferredCourier = couriers.find(
      (courier) =>
        String(courier.courier_company_id) === preferredCourierCompanyId
    );
    const couriersToReturn = preferredCourier
      ? [preferredCourier]
      : [...couriers].sort(
          (left, right) =>
            Number(left.rate ?? left.freight_charge ?? Infinity) -
            Number(right.rate ?? right.freight_charge ?? Infinity)
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
      error.response?.data || error.message
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

    if (shipment.awbCode) {
      return res.status(200).json({
        success: true,
        message: "Courier and AWB are already assigned",
        shipment,
      });
    }

    const order = await orderModel.findById(shipment.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pickupPostcode = String(
      shipment.pickupPostcode || req.vendor.pickupAddress?.pincode || ""
    ).trim();
    const deliveryPostcode = String(order.shippingAddress?.pincode || "").trim();
    if (!/^\d{6}$/.test(pickupPostcode) || !/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        message: "Vendor pickup and customer delivery addresses must both have valid six-digit pincodes",
      });
    }

    const shiprocketResponse = await getAvailableShiprocketCouriers({
      shipmentId: shipment.shiprocketShipmentId,
      pickupPostcode,
      deliveryPostcode,
      weight: 0.5,
      cod: order.paymentMethod?.toLowerCase() === "cod" ? 1 : 0,
      declaredValue: order.totalAmount,
    });
    const availableCouriers =
      shiprocketResponse.data?.available_courier_companies ||
      shiprocketResponse.available_courier_companies ||
      [];
    const vendorQuote = (order.vendorShippingQuotes || []).find(
      (quote) => quote.vendorId.toString() === req.vendor._id.toString()
    );
    const preferredCourierCompanyId = String(
      shipment.courierCompanyId ||
        vendorQuote?.courierCompanyId ||
        process.env.SHIPROCKET_COURIER_ID ||
        ""
    );
    const preferredIsAvailable = availableCouriers.some(
      (courier) =>
        String(courier.courier_company_id) === preferredCourierCompanyId
    );
    const requestedCourierCompanyId = String(
      req.body?.courierCompanyId ||
        (preferredIsAvailable ? preferredCourierCompanyId : "")
    );
    const requestedIsAvailable = availableCouriers.some(
      (courier) =>
        String(courier.courier_company_id) === requestedCourierCompanyId
    );

    if (!requestedIsAvailable || (preferredIsAvailable && requestedCourierCompanyId !== preferredCourierCompanyId)) {
      return res.status(400).json({
        message: "Select a courier available for this pickup and delivery route",
      });
    }

    const assignment = await assignShiprocketCourier(
      shipment.shiprocketShipmentId,
      Number(requestedCourierCompanyId)
    );
    const assignmentData =
      assignment.response?.data || assignment.data || assignment.response || assignment;

    if (!assignmentData.awb_code) {
      return res.status(502).json({
        message: "Shiprocket did not return an AWB code",
        error: assignment,
      });
    }

    shipment.awbCode = String(assignmentData.awb_code);
    shipment.courierCompanyId = String(
      assignmentData.courier_company_id || requestedCourierCompanyId
    );
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
    console.log(
      "Assign Courier Error:",
      error.response?.data || error.message
    );

    return res.status(error.response ? 502 : 500).json({
      message: "Could not assign courier",
      error: error.response?.data || error.message,
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

    const hasVendorItems = order.items.some(
      (item) => item.vendorId.toString() === req.vendor._id.toString()
    );

    if (!hasVendorItems) {
      return res.status(403).json({ message: "You do not own items in this order" });
    }

    const shipment = await shipOrder.findOne({
      orderId: order._id,
      vendorId: req.vendor._id,
    });
    if (!shipment || !shipment.awbCode || shipment.status !== "AWB_ASSIGNED") {
      return res.status(400).json({
        message: "Accept this vendor order and assign an AWB before processing it",
      });
    }

    shipment.status = "PROCESSING";
    await shipment.save();
    await refreshMarketplaceOrderStatus(order);

    return res.status(200).json({
      success: true,
      message: "Order marked as Processing",
      order,
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

    const hasVendorItems = order.items.some(
      (item) => item.vendorId.toString() === req.vendor._id.toString()
    );

    if (!hasVendorItems) {
      return res.status(403).json({ message: "You do not own items in this order" });
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
      shipment.shiprocketShipmentId
    );

    if (
      pickupResponse.pickup_status === 0 ||
      pickupResponse.pickup_status === false ||
      pickupResponse.status === false ||
      pickupResponse.status === "ERROR"
    ) {
      return res.status(502).json({
        message: "Shiprocket could not schedule pickup",
        error: pickupResponse,
      });
    }

    shipment.status = "PICKUP_REQUESTED";
    await shipment.save();
    await refreshMarketplaceOrderStatus(order);

    return res.status(200).json({
      success: true,
      message: "Order shipped and pickup requested",
      order,
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
    });
    const trackingData =
      trackingResponse.tracking_data ||
      trackingResponse.data?.tracking_data ||
      trackingResponse;
    const latestTracking = trackingData.shipment_track?.[0] || {};

    return res.status(200).json({
      success: true,
      shipment,
      tracking: {
        ...trackingData,
        currentStatus:
          latestTracking.current_status || trackingData.shipment_status || shipment.status,
        courierName:
          latestTracking.courier_name || trackingData.courier_name || shipment.courierName,
        awbCode:
          latestTracking.awb_code || trackingData.awb_code || shipment.awbCode,
        history:
          trackingData.shipment_track_activities ||
          latestTracking.shipment_track_activities ||
          [],
        estimatedDelivery:
          latestTracking.etd || trackingData.etd || trackingData.estimated_delivery_date || null,
      },
    });
  } catch (error) {
    console.log(
      "Get Vendor Shipment Tracking Error:",
      error.response?.data || error.message
    );

    return res.status(error.response ? 502 : 500).json({
      message: "Could not get shipment tracking",
      error: error.response?.data || error.message,
    });
  }
};