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
    const ordersWithShipments = orders.map((order) => ({
      ...order.toObject(),
      shipment: shipmentByOrderId.get(order._id.toString()) || null,
    }));

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

    if (existingOrder.status !== "Pending") {
      return res.status(400).json({
        message: "Order cannot be accepted",
      });
    }

    const shiprocketOrder = await createShiprocketOrderFromOrder({
      ...existingOrder.toObject(),
      items: vendorItems,
    });

    const newShipOrder = await shipOrder.create({
      orderId: existingOrder._id,
      userId: existingOrder.userId,
      vendorId: vendorId,

      shiprocketOrderId: shiprocketOrder.order_id,
      shiprocketShipmentId: shiprocketOrder.shipment_id,

      awbCode: shiprocketOrder.awb_code || "",
      courierCompanyId: shiprocketOrder.courier_company_id || "",
      courierName: shiprocketOrder.courier_name || "",

      status: shiprocketOrder.status || "NEW",
    });

    existingOrder.status = "Confirmed";

    await existingOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order accepted and Shiprocket shipment created",
      order: existingOrder,
      shipment: newShipOrder,
    });
  } catch (error) {
    console.log(
      "Accept Order Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to accept order",
      error: error.response?.data || error.message,
    });
  }
};

export const getAvailableCouriers = async (req, res) => {
  try {
    const { shipOrderId } = req.params;
    const vendorId = req.vendor._id;
    const pickupPostcode = String(
      req.query.pickupPostcode || process.env.SHIPROCKET_PICKUP_POSTCODE || ""
    ).trim();

    const shipment = await findVendorShipment(shipOrderId, vendorId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (!/^\d{6}$/.test(pickupPostcode)) {
      return res.status(400).json({
        message:
          "A valid six-digit pickupPostcode query or SHIPROCKET_PICKUP_POSTCODE setting is required",
      });
    }

    const order = await orderModel.findById(shipment.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const deliveryPostcode = String(order.shippingAddress?.pincode || "").trim();

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

    return res.status(200).json({
      success: true,
      couriers: couriers.map((courier) => ({
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
    const courierCompanyId = Number(req.body?.courierCompanyId);

    if (!Number.isInteger(courierCompanyId) || courierCompanyId <= 0) {
      return res.status(400).json({
        message: "A valid courierCompanyId is required",
      });
    }

    const shipment = await findVendorShipment(shipOrderId, req.vendor._id);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const assignment = await assignShiprocketCourier(
      shipment.shiprocketShipmentId,
      courierCompanyId
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
      assignmentData.courier_company_id || courierCompanyId
    );
    shipment.courierName = assignmentData.courier_name || "";
    shipment.status = "AWB_ASSIGNED";
    await shipment.save();

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

    if (order.status !== "Pending" && order.status !== "Confirmed") {
      return res.status(400).json({
        message: `Order cannot move to Processing from ${order.status}`,
      });
    }

    order.status = "Processing";
    await order.save();

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

    if (order.status !== "Processing") {
      return res.status(400).json({
        message: "Order must be Processing before it can be shipped",
      });
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
    order.status = "Shipped";

    await shipment.save();
    await order.save();

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