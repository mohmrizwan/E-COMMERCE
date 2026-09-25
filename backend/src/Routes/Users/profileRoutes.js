import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  getOrder,
  getProfile,
  updateAddress,
  updateProfile,
} from "../../Controllers/User/ProfileContoller.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import {
  addToFavorite,
  getFavorites,
  deleteFavorite
} from "../../Controllers/User/FavoritesController.js";
const router = express.Router();

router.get("/getProfile", AuthMiddleware, getProfile);
router.put("/updateProfile", AuthMiddleware, updateProfile);
router.get("/myOrder", AuthMiddleware, getOrder);
router.get("/address", AuthMiddleware, getAddresses);
router.post("/address", AuthMiddleware, addAddress);
router.put("/address/:addressId", AuthMiddleware, updateAddress);
router.delete("/address/:addressId", AuthMiddleware, deleteAddress);
router.post("/favorites/:productId", AuthMiddleware, addToFavorite);
router.get("/favorites", AuthMiddleware, getFavorites);
router.delete("/favorites/:productId", AuthMiddleware, deleteFavorite);
export default router;
