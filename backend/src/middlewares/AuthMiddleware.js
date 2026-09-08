import jwt from "jsonwebtoken";
import UserModel from "../models/user/AuthModel.js";

const AuthMiddleware = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await UserModel.findById(decoded.userId).select(
      "-password -otp -otpExpiresAt",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default AuthMiddleware;
