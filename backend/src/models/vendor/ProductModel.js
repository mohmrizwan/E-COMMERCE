import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    pricing: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      min: 0,
      max: 99,
      default: 0,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    // Optional for legacy products; checkout and shipment creation require
    // complete values before requesting a Shiprocket quote.
    weight: { type: Number, min: 0.0001 },
    length: { type: Number, min: 0.5001 },
    breadth: { type: Number, min: 0.5001 },
    height: { type: Number, min: 0.5001 },
    isDangerous: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
