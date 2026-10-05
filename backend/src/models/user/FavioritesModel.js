import mongoose from "mongoose";

const FavoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

const FavoritesModel = mongoose.model("Favorites", FavoritesSchema);

export default FavoritesModel;
