import mongoose from "mongoose";

const shipSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "myOrders",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    shiprocketOrderId: {
      type: String,
      default: "",
    },

    shiprocketShipmentId: {
      type: String,
      default: "",
    },

    awbCode: {
      type: String,
      default: "",
    },

    courierCompanyId: {
      type: String,
      default: "",
    },

    courierName: {
      type: String,
      default: "",
    },

    pickupLocationName: {
      type: String,
      default: "",
    },

    pickupPostcode: {
      type: String,
      default: "",
    },

    deliveryPostcode: {
      type: String,
      default: "",
    },

    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    estimatedShippingCost: { type: Number, default: null },
    actualShippingCost: { type: Number, default: null },

    status: {
      type: String,
      default: "CREATING",
    },

    trackingStatus: { type: String, default: "" },
    trackingUpdatedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

shipSchema.index({ orderId: 1, vendorId: 1 }, { unique: true });

const shipOrder = mongoose.model("ShipOrder", shipSchema);

export default shipOrder;
