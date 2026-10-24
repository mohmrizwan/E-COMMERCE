import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model(
  "Category",
  categorySchema
);

export default CategoryModel;
