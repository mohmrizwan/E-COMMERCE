import express from "express";
import { createProduct } from "../../Controllers/Vendor/ProductController.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import upload from "../../middlewares/multer.js";
import cloudinary from "../../Config/Cloudinary.js";
const router = express.Router();

router.post(
  "/create",
  VendorAuthMiddleware,
  upload.single("image"),
  createProduct,
);

export default router;
