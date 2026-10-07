import mongoose from "mongoose";

const IntegrationSchema = new mongoose.Schema(
  {
    razorpay: {
      linkedAccountId: { type: String, trim: true, default: "" },
      enabled: { type: Boolean, default: false },
      accountStatus: { type: String, trim: true, default: "" },
      productConfigId: { type: String, trim: true, default: "" },
      productActivationStatus: { type: String, trim: true, default: "" },
      settlementVerificationStatus: { type: String, trim: true, default: "" },
      onboardingInProgress: { type: Boolean, default: false },
    },
    shiprocket: {
      emailEncrypted: { type: String, select: false, default: "" },
      passwordEncrypted: { type: String, select: false, default: "" },
      enabled: { type: Boolean, default: false },
    },
  },
  { _id: false },
);

const AuthSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    pickupAddress: {
      name: { type: String, trim: true, default: "" },
      phone: { type: String, trim: true, default: "" },
      shiprocketLocationName: { type: String, trim: true, default: "" },
      address: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      pincode: { type: String, trim: true, default: "" },
    },

    integrations: {
      type: IntegrationSchema,
      default: () => ({}),
    },

    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const AuthVendor = mongoose.model("Vendor", AuthSchema);

export default AuthVendor;
