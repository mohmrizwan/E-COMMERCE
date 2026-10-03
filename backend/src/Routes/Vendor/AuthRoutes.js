import express from "express";
const router = express.Router();
import {
    LoginAccount,
  forgotPassword,
  getVendorPickupAddress,
  resetPassword,
  verifyResetOtp,
  updateVendorPickupAddress,
  registerVendor,
  resendOtp,
  verifyOtp,
} from "../../Controllers/Vendor/AuthControllers.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";

router.post("/register", registerVendor);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);
router.post("/login", LoginAccount);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.get("/profile/pickup-address", VendorAuthMiddleware, getVendorPickupAddress);
router.put("/profile/pickup-address", VendorAuthMiddleware, updateVendorPickupAddress);

export default router;
