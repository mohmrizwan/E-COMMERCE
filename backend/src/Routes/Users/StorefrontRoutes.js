import express from "express";
import {
  getStorefront,
  getStorefrontBanners,
  getStorefrontProducts,
} from "../../Controllers/User/StorefrontController.js";

const router = express.Router();
router.get("/", getStorefront);
router.get("/products", getStorefrontProducts);
router.get("/banners", getStorefrontBanners);

export default router;
