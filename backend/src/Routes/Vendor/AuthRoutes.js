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
  getVendorProfile,
  updateVendorProfile,
} from "../../Controllers/Vendor/AuthControllers.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import upload from "../../middlewares/multer.js";

router.post("/register", registerVendor);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);
router.post("/login", LoginAccount);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.get(
  "/profile/pickup-address",
  VendorAuthMiddleware,
  getVendorPickupAddress,
);
router.put(
  "/profile/pickup-address",
  VendorAuthMiddleware,
  updateVendorPickupAddress,
);
router.get("/myProfile", VendorAuthMiddleware, getVendorProfile);
router.put("/myProfile", VendorAuthMiddleware, (req, res, next) => {
  upload.single("websiteLogo")(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message });
    next();
  });
}, updateVendorProfile);

export default router;
