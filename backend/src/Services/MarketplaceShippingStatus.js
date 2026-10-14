import orderModel from "../models/user/MyOrdersModel.js";
import shipOrder from "../models/Shiprocket/ShipOrder.js";

export const normalizeShiprocketTrackingStatus = (value) => {
  const status = String(value || "").trim().toUpperCase();
  if (!status) return "";
  if (status.includes("DELIVERED")) return "DELIVERED";
  if (/OUT FOR DELIVERY|IN TRANSIT|PICKED UP|SHIPPED|PICKUP SCHEDULED/.test(status)) {
    return "SHIPPED";
  }
  if (/PROCESSING|READY TO SHIP|MANIFEST/.test(status)) return "PROCESSING";
  return "";
};

export const refreshMarketplaceOrderStatus = async (order) => {
  const vendorIds = [...new Set(order.items.map((item) => item.vendorId.toString()))];
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
  const stageStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const vendorStages = vendorIds.map((vendorId) => {
    const shipment = shipmentByVendorId.get(vendorId);
    const vendorStatus = shipment?.status === "DELIVERED"
      ? "Delivered"
      : shipment?.status === "SHIPPED"
        ? "Shipped"
        : shipment?.status === "PROCESSING"
          ? "Processing"
          : ["PICKUP_REQUESTED", "SHIPPED"].includes(shipment?.status)
            ? "Shipped"
          : shipment?.status === "AWB_ASSIGNED"
            ? "Confirmed"
            : shipment?.shiprocketShipmentId
              ? "Awaiting AWB"
              : "Pending";
    return statusStages[vendorStatus];
  });

  order.status = stageStatuses[vendorStages.length ? Math.min(...vendorStages) : 0];
  await order.save();
};

export const updateTrackingSnapshot = async (shipment, trackingData) => {
  const track = trackingData.shipment_track?.[0] || {};
  const providerStatus = String(
    track.current_status || trackingData.shipment_status || "",
  ).trim();
  const normalizedStatus = normalizeShiprocketTrackingStatus(providerStatus);
  if (!providerStatus) return;

  shipment.trackingStatus = providerStatus;
  shipment.trackingUpdatedAt = new Date();
  if (normalizedStatus) shipment.status = normalizedStatus;
  await shipment.save();

  const order = await orderModel.findById(shipment.orderId);
  if (order && normalizedStatus) await refreshMarketplaceOrderStatus(order);
};
