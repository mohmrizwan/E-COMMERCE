import VendorModel from "../../models/vendor/AuthModel.js";
import bcrypt from "bcrypt";
import sendOtp from "../../utils/sendOtp.js";
import generateToken from "../../utils/GenerateToken.js";

export const registerVendor = async (req, res) => {
  try {
    const { businessName, ownerName, email, phone, password, confirmPassword } =
      req.body;

    // Check all required fields
    if (
      !businessName ||
      !ownerName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check existing email
    const vendorExisted = await VendorModel.findOne({ email });

    if (vendorExisted) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check existing phone
    const phoneExisted = await VendorModel.findOne({ phone });

    if (phoneExisted) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 10 minutes
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create vendor
    const vendorCreated = await VendorModel.create({
      businessName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    // Send OTP
    const emailSent = await sendOtp(email, otp);

    // If OTP email failed, delete vendor
    if (!emailSent) {
      await VendorModel.findByIdAndDelete(vendorCreated._id);

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Vendor created. OTP sent to your email",
      vendorId: vendorCreated._id,
    });
  } catch (error) {
    console.error("Vendor Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { vendorId, otp } = req.body;

    // check required fields
    if (!vendorId || !otp) {
      return res
        .status(400)
        .json({ message: "Vendor ID and OTP are required", success: false });
    }

    // find vendor by id
    const vendor = await VendorModel.findById(vendorId);

    // check if vendor exists

    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor not found", success: false });
    }

    // Already verified
    if (vendor.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    if (vendor.otp !== otp) {
      return res.status(409).json({ message: "Invalid OTP" });
    }
    // Check OTP expiry
    if (!vendor.otpExpiresAt || vendor.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }
    vendor.isVerified = true;
    vendor.otp = null;
    vendor.otpExpiresAt = null;


    await vendor.save();
    return res
      .status(200)
      .json({ message: "Email Verified Successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const vendor = await VendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "vendor not found",
      });
    }

    if (vendor.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    vendor.otp = otp;
    vendor.otpExpiresAt = otpExpiresAt;

    await vendor.save();

    const emailSent = await sendOtp(vendor.email, otp);

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

export const LoginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    let vendorFind = await VendorModel.findOne({ email });

    if (!vendorFind) {
      return res.status(401).json({ message: "Invalid Email Address" });
    }

    if (!vendorFind.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    const comparePassword = await bcrypt.compare(password, vendorFind.password);

    if (!comparePassword) {
      return res.status(401).json({ message: "Enter Correct Password" });
    }

    let token = generateToken(vendorFind);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      vendorFind: {
        id: vendorFind._id,
        name: vendorFind.name,
        email: vendorFind.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await VendorModel.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: "Email not found" });
    }

    vendor.otp = Math.floor(100000 + Math.random() * 900000).toString();
    vendor.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await vendor.save();

    const emailSent = await sendOtp(vendor.email, vendor.otp);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      vendorId: vendor._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { vendorId, otp } = req.body;
    const vendor = await VendorModel.findById(vendorId);

    if (!vendor || vendor.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!vendor.otpExpiresAt || vendor.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { vendorId, password, confirmPassword } = req.body;

    if (!vendorId || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const vendor = await VendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.password = await bcrypt.hash(password, 10);
    vendor.otp = null;
    vendor.otpExpiresAt = null;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};