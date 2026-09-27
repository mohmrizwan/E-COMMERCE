import express from "express";

import { getAllProducts } from "../../Controllers/User/ProductCOntroller.js";

import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/allProducts", getAllProducts);

export default router;