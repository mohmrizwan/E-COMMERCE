import bcrypt from "bcrypt";
import UserModel from "../../models/user/AuthModel.js";
import sendOtp from "../../utils/SendOtp.js";
import generateToken from "../../utils/GenerateToken.js";

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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
    // console.log("Create Account Error:", error);

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

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;

    await user.save();

    const emailSent = await sendOtp(user.email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// Login User
export const LoginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    let userFind = await UserModel.findOne({ email });

    if (!userFind) {
      return res.status(401).json({ message: "Invalid Email Address" });
    }

    if (!userFind.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    const comparePassword = await bcrypt.compare(password, userFind.password);

    if (!comparePassword) {
      return res.status(401).json({ message: "Enter Correct Password" });
    }

    let token = generateToken(userFind);

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userFind = await UserModel.findOne({ email });

    if (!userFind) {
      return res.status(404).json({ message: "Enter Valid Email Address" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    userFind.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await userFind.save();

    const emailSent = await sendOtp(email, otp);

    if (!emailSent) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// verfiyForgotPassword
export const verifyForgotPassword = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "Enter all fields" });
    }

    const userFind = await UserModel.findOne({ userId });

    if (!userFind) {
      return res.status(404).json({ message: "Invalid Userid" });
    }

    if (userFind.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      userId: user._id,
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
    const { userId, password, confirmPassword } = req.body;
    if (!userId || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
