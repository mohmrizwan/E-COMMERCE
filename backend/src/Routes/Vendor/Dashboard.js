import express from "express";
import {
  getVendorIncome,
  getVendorOrdersCount,
  getVendorProductsCount,
  getVendorCustomersCount,
  getVendorOrderStatusSummary,
  getVendorRecentOrders,
  getVendorRecentCustomers,
  getVendorProductCategories,
} from "../../Controllers/Vendor/DashBoard.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
const router = express.Router();

router.get("/income", VendorAuthMiddleware, getVendorIncome);
router.get("/orders", VendorAuthMiddleware, getVendorOrdersCount);
router.get("/products", VendorAuthMiddleware, getVendorProductsCount);
router.get("/customers", VendorAuthMiddleware, getVendorCustomersCount);
router.get("/order-status", VendorAuthMiddleware, getVendorOrderStatusSummary);
router.get("/recent-orders", VendorAuthMiddleware, getVendorRecentOrders);
router.get("/recent-customers", VendorAuthMiddleware, getVendorRecentCustomers);
router.get("/categories", VendorAuthMiddleware, getVendorProductCategories);

export default router;
