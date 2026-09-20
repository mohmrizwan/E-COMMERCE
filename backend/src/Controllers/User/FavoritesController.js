import FavoritesModel from "../../models/user/FavioritesModel.js";
// import ProductModel from "../../Models/user/ProductModel"  will add soon;

export const addToFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Check product
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find user's favorites
    let favorites = await FavoritesModel.findOne({ userId });

    // Create favorites document if not exists
    if (!favorites) {
      favorites = await FavoritesModel.create({
        userId,
        favorites: [productId],
      });

      return res.status(201).json({
        success: true,
        message: "Product added to favorites",
        favorites,
      });
    }

    // Check already exists
    const alreadyFavorite = favorites.favorites.includes(productId);

    if (alreadyFavorite) {
      // Remove
      favorites.favorites = favorites.favorites.filter(
        (id) => id.toString() !== productId,
      );

      await favorites.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from favorites",
        favorites,
      });
    }

    // Add
    favorites.favorites.push(productId);

    await favorites.save();

    return res.status(200).json({
      success: true,
      message: "Product added to favorites",
      favorites,
    });
  } catch (error) {
    console.error("Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await FavoritesModel.findOne({ userId }).populate(
      "favorites",
    );

    if (!favorites) {
      return res.status(200).json({
        success: true,
        favorites: [],
      });
    }

    return res.status(200).json({
      success: true,
      favorites: favorites.favorites,
    });
  } catch (error) {
    console.error("Get Favorites Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const deleteFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const favorites = await FavoritesModel.findOne({ userId });

    if (!favorites) {
      return res.status(404).json({
        success: false,
        message: "Favorites not found",
      });
    }

    const isFavorite = favorites.favorites.some(
      (id) => id.toString() === productId,
    );

    if (!isFavorite) {
      return res.status(404).json({
        success: false,
        message: "Product is not in favorites",
      });
    }

    favorites.favorites = favorites.favorites.filter(
      (id) => id.toString() !== productId,
    );

    await favorites.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from favorites",
      favorites: favorites.favorites,
    });
  } catch (error) {
    console.error("Delete Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
