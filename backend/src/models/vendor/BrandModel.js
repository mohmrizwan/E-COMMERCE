import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
