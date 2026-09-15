import VendorModel from "../../models/vendor/AuthModel.js";
import bcrypt from "bcrypt";
import sendOtp  from "../../utils/sendOtp.js";

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
