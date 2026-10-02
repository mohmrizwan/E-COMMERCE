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
      required: true,
    },

    shiprocketShipmentId: {
      type: String,
      required: true,
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

    status: {
      type: String,
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

const shipOrder = mongoose.model("ShipOrder", shipSchema);

export default shipOrder;