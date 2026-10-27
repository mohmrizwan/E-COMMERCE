import express from "express";
import {
  getStorefront,
  getStorefrontBanners,
  getStorefrontBrands,
  getStorefrontCategories,
  getStorefrontProducts,
} from "../../Controllers/User/StorefrontController.js";

const router = express.Router();
router.get("/", getStorefront);
router.get("/products", getStorefrontProducts);
router.get("/banners", getStorefrontBanners);
router.get("/brands", getStorefrontBrands);
router.get("/categories", getStorefrontCategories);

export default router;
