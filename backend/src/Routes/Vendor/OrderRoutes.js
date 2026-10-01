import express from "express";
import { getMyOrders } from "../../Controllers/Vendor/MyOrders.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
const router = express.Router();

router.get("/myOrders", VendorAuthMiddleware, getMyOrders);

export default router;
