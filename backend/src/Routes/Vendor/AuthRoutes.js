import express from "express";
const router = express.Router();
import {
    LoginAccount,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
  registerVendor,
  resendOtp,
  verifyOtp,
} from "../../Controllers/Vendor/AuthControllers.js";

router.post("/register", registerVendor);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);
router.post("/login", LoginAccount);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;
