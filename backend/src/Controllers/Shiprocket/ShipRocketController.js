import mongoose from "mongoose";
import shipOrder from "../../models/Shiprocket/ShipOrder.js";
import {
  createShiprocketOrder,
  getShiprocketToken,
  getShiprocketTracking,
} from "../../Services/ShipRocket.js";

export const testShiprocket = async (req, res) => {
  try {
    await getShiprocketToken();

    return res.status(200).json({
      success: true,
      message: "Shiprocket connection successful",
    });
  } catch (error) {
    return res.status(error.response ? 502 : 500).json({
      success: false,
      message: "Shiprocket connection failed",
      error: error.response?.data || error.message,
    });
  }
};

export const testCreateShiprocketOrder = async (req, res) => {
  try {
    const shiprocketOrder = await createShiprocketOrder(req.body);

    return res.status(200).json({
      success: true,
      shiprocketOrder,
    });
  } catch (error) {
    return res.status(error.response ? 502 : 500).json({
      success: false,
      message: "Could not create Shiprocket order",
      error: error.response?.data || error.message,
    });
  }
};

export const getCustomerShipmentTracking = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({ message: "Invalid shipment or order ID" });
    }

    const shipment = await shipOrder.findOne({
      userId: req.user._id,
      $or: [{ _id: shipmentId }, { orderId: shipmentId }],
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
      "Get Customer Shipment Tracking Error:",
      error.response?.data || error.message
    );

    return res.status(error.response ? 502 : 500).json({
      message: "Could not get shipment tracking",
      error: error.response?.data || error.message,
    });
  }
};