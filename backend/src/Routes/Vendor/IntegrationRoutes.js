import express from "express";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import {
  getVendorIntegrations,
  updateVendorIntegrations,
} from "../../Controllers/Vendor/IntegrationController.js";

const router = express.Router();

router.get("/", VendorAuthMiddleware, getVendorIntegrations);
router.put("/", VendorAuthMiddleware, updateVendorIntegrations);

export default router;