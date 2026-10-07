import express from "express";
import { getVendorTransactions } from "../../Controllers/Vendor/Transaction.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";

const router = express.Router();

router.get("/myTransactions", VendorAuthMiddleware, getVendorTransactions);

export default router;
