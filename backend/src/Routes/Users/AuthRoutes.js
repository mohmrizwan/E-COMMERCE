import express from "express";
import {
  CreateAccount,
  forgotPassword,
  GoogleLogin,
  LoginAccount,
  resendOtp,
  resetPassword,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../../Controllers/User/AuthController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

// Simple in-memory IP-based rate limiter for the customer login endpoint.
// Keeps IP-level throttling separate from account-level failed-password counting.
// For multi-instance production deployments, back this with Redis (e.g. express-rate-limit + Redis store).
const loginIpAttempts = new Map(); // ip => { count, windowStart }

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 10; // max login attempts per window per IP

const loginRateLimiter = (req, res, next) => {
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown";
  const now = Date.now();

  const record = loginIpAttempts.get(ip);
  if (!record || now - record.windowStart > LOGIN_WINDOW_MS) {
    loginIpAttempts.set(ip, { count: 1, windowStart: now });
    return next();
  }

  if (record.count >= LOGIN_MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  }

  record.count += 1;
  next();
};

const router = express.Router();

router.post("/create", CreateAccount);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/login", loginRateLimiter, LoginAccount);
router.post("/google-login", GoogleLogin);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyForgotOtp", verifyForgotPasswordOtp);
router.post("/resetPassword", resetPassword);

export default router;
export { loginRateLimiter, LOGIN_WINDOW_MS, LOGIN_MAX_ATTEMPTS };
