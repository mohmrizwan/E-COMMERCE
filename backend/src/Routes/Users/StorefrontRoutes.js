import express from "express";
import {
  getStorefront,
  getStorefrontProducts,
} from "../../Controllers/User/StorefrontController.js";

const router = express.Router();
router.get("/", getStorefront);
router.get("/products", getStorefrontProducts);

export default router;
