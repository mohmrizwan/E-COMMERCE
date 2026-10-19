import express from "express";

import { getAllProducts, getProductById } from "../../Controllers/User/ProductCOntroller.js";

import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/allProducts", getAllProducts);
router.get("/:id", getProductById);

export default router;
