import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModel from "../../models/user/AuthModel.js";
import sendOtp from "../../utils/SendOtp.js";
import generateToken from "../../utils/generateToken.js";
import { verifyGoogleCredential } from "../../utils/googleAuth.js";

// create
export const CreateAccount = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check all fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter all details",
      });
    }

    // Check password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check existing user
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // OTP expiry - 10 minutes
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const userCreated = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isVerified: false,
      authProvider: "local",
      emailVerified: false,
      profileImage: "",
    });

    // Send OTP through Gmail
    const emailSent = await sendOtp(email, otp);

    if (!emailSent) {
      // If email failed, remove created user
      await UserModel.findByIdAndDelete(userCreated._id);

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created. OTP sent to your email",
      userId: userCreated._id,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // Check required fields
    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    // Find user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid OTP",
      });
    }

    // Check OTP expiry
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Verify account
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// resend otp
export const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const emailSent = await sendOtp(user.email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const GENERIC_AUTH_ERROR = "Invalid email or password";

// Login User
export const LoginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const userFind = await UserModel.findOne({ email: normalizedEmail });

    // Generic error: do not reveal whether the email exists
    if (!userFind) {
      return res.status(401).json({ success: false, message: GENERIC_AUTH_ERROR });
    }

    // If account is currently locked, reject with generic error
    if (
      userFind.lockUntil &&
      userFind.lockUntil > new Date() &&
      (userFind.failedLoginAttempts || 0) >= MAX_FAILED_ATTEMPTS
    ) {
      return res.status(401).json({ success: false, message: GENERIC_AUTH_ERROR });
    }

    // If lock has expired, reset counters so the user can try again
    if (userFind.lockUntil && userFind.lockUntil <= new Date()) {
      await UserModel.updateOne(
        { _id: userFind._id },
        { $set: { failedLoginAttempts: 0, lockUntil: null } }
      );
    }

    // Google accounts do not have a local password
    if (!userFind.password) {
      return res.status(401).json({ success: false, message: GENERIC_AUTH_ERROR });
    }

    if (!userFind.isVerified) {
      return res.status(401).json({ success: false, message: GENERIC_AUTH_ERROR });
    }

    const comparePassword = await bcrypt.compare(password, userFind.password);

    if (comparePassword) {
      // Correct password: reset failed attempts and clear any lock
      await UserModel.updateOne(
        { _id: userFind._id },
        { $set: { failedLoginAttempts: 0, lockUntil: null } }
      );

      const token = generateToken(userFind);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        userFind: {
          id: userFind._id,
          name: userFind.name,
          email: userFind.email,
        },
      });
    }

    // Wrong password: atomically increment failed attempts only if not locked
    const updated = await UserModel.findOneAndUpdate(
      {
        email: normalizedEmail,
        $or: [
          { lockUntil: { $exists: false } },
          { lockUntil: null },
          { lockUntil: { $lte: new Date() } },
        ],
      },
      { $inc: { failedLoginAttempts: 1 } },
      { new: true }
    );

    // If the account became locked between our check and this update, reject generically
    if (!updated) {
      return res.status(401).json({ success: false, message: GENERIC_AUTH_ERROR });
    }

    // If this attempt reached the limit and account is not already locked, lock it
    if (
      updated.failedLoginAttempts >= MAX_FAILED_ATTEMPTS &&
      (!updated.lockUntil || updated.lockUntil <= new Date())
    ) {
      await UserModel.updateOne(
        { _id: updated._id },
        { $set: { lockUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) } }
      );
    }

    return res.status(401).json({ success: false, message: GENERIC_AUTH_ERROR });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const GoogleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const googleUser = await verifyGoogleCredential(credential);

    let user = await UserModel.findOne({ email: googleUser.email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await UserModel.create({
        name: googleUser.name,
        email: googleUser.email,
        password: hashedPassword,
        googleId: googleUser.googleId,
        profileImage: googleUser.picture || "",
        authProvider: "google",
        emailVerified: true,
        isVerified: true,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: "Google signup successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          authProvider: user.authProvider,
          isVerified: user.isVerified,
        },
      });
    }

    user.googleId = user.googleId || googleUser.googleId;
    user.profileImage = user.profileImage || googleUser.picture || "";
    user.authProvider = user.authProvider || "google";
    user.emailVerified = true;
    user.isVerified = true;

    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Google authentication failed",
    });
  }
};
// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userFind = await UserModel.findOne({ email });

    if (userFind) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      userFind.otp = otp;
      userFind.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await userFind.save();

      const emailSent = await sendOtp(email, otp);
      if (!emailSent) {
        userFind.otp = null;
        userFind.otpExpiresAt = null;
        await userFind.save();
      }
    }
    return res.status(202).json({
      success: true,
      message: "If the account exists, a verification code has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// verfiyForgotPassword
export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Enter all fields" });
    }

    const userFind = await UserModel.findOne({ email });

    if (!userFind || userFind.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!userFind.otpExpiresAt || userFind.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// reset password
export const resetPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { otp, password, confirmPassword } = req.body;
    if (!email || !otp || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findOneAndUpdate(
      { email, otp, otpExpiresAt: { $gt: new Date() } },
      {
        $set: { password: hashedPassword, otp: null, otpExpiresAt: null },
        $inc: { tokenVersion: 1 },
      },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification code is invalid or expired. Request a new code.",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
