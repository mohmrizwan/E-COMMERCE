import express from "express";
import {
  createProduct,
  deleteproduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../../Controllers/Vendor/ProductController.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import upload from "../../middlewares/multer.js";
import cloudinary from "../../Config/Cloudinary.js";
const router = express.Router();

router.post(
  "/create",
  VendorAuthMiddleware,
  upload.array("images", 10),
  createProduct,
);

router.get("/getAllProducts", VendorAuthMiddleware, getAllProducts);
router.delete("/delete/:id", VendorAuthMiddleware, deleteproduct);
router.put("/update/:id", VendorAuthMiddleware, upload.array("images", 10), updateProduct);
router.get("/products/:id", VendorAuthMiddleware, getProductById);

export default router;
