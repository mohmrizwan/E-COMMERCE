import express from "express";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import {
  getVendorIntegrations,
  updateVendorIntegrations,
  onboardVendorWithRazorpayRoute,
  refreshVendorRazorpayStatus,
} from "../../Controllers/Vendor/IntegrationController.js";

const router = express.Router();

router.get("/", VendorAuthMiddleware, getVendorIntegrations);
router.put("/", VendorAuthMiddleware, updateVendorIntegrations);
router.post(
  "/razorpay/onboard",
  VendorAuthMiddleware,
  onboardVendorWithRazorpayRoute,
);
router.get(
  "/razorpay/status",
  VendorAuthMiddleware,
  refreshVendorRazorpayStatus,
);

export default router;