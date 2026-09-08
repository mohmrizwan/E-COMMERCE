import express from "express";
import {
  CreateAccount,
  forgotPassword,
  LoginAccount,
  resendOtp,
  resetPassword,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../../Controllers/User/AuthController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/create", CreateAccount);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/login", LoginAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyForgotOtp", verifyForgotPasswordOtp);
router.post("/resetPassword", resetPassword);

export default router;
