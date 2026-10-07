import VendorModel from "../../models/vendor/AuthModel.js";
import { encryptCredential } from "../../utils/credentialEncryption.js";

const configurationStatus = (vendor) => ({
  razorpay: {
    linkedAccountId: vendor.integrations?.razorpay?.linkedAccountId || "",
    enabled: Boolean(vendor.integrations?.razorpay?.enabled),
    isLinked: Boolean(vendor.integrations?.razorpay?.linkedAccountId),
  },
  shiprocket: {
    enabled: Boolean(vendor.integrations?.shiprocket?.enabled),
    hasEmail: Boolean(vendor.integrations?.shiprocket?.emailEncrypted),
    hasPassword: Boolean(vendor.integrations?.shiprocket?.passwordEncrypted),
  },
});

export const getVendorIntegrations = async (req, res) => {
  const vendor = await VendorModel.findById(req.vendor._id).select(
    "+integrations.shiprocket.emailEncrypted +integrations.shiprocket.passwordEncrypted",
  );

  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  return res.status(200).json({
    success: true,
    integrations: configurationStatus(vendor),
    pickupAddress: vendor.pickupAddress || {},
  });
};

export const updateVendorIntegrations = async (req, res) => {
  try {
    const shiprocket = req.body?.shiprocket;
    if (req.body?.razorpay !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Razorpay Route linked accounts must be provisioned by the platform",
      });
    }
    const vendor = await VendorModel.findById(req.vendor._id).select(
      "+integrations.shiprocket.emailEncrypted +integrations.shiprocket.passwordEncrypted",
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    if (shiprocket !== undefined) {
      if (!shiprocket || typeof shiprocket !== "object" || Array.isArray(shiprocket)) {
        return res.status(400).json({ success: false, message: "Invalid Shiprocket configuration" });
      }
      if (typeof shiprocket.email === "string" && shiprocket.email.trim()) {
        const email = shiprocket.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid Shiprocket account email",
          });
        }
        vendor.integrations.shiprocket.emailEncrypted = encryptCredential(email);
      }
      if (typeof shiprocket.password === "string" && shiprocket.password.trim()) {
        if (shiprocket.password.length > 256) {
          return res.status(400).json({
            success: false,
            message: "Shiprocket password is too long",
          });
        }
        vendor.integrations.shiprocket.passwordEncrypted = encryptCredential(shiprocket.password.trim());
      }
      if (shiprocket.enabled !== undefined) {
        if (typeof shiprocket.enabled !== "boolean") {
          return res.status(400).json({ success: false, message: "Shiprocket enabled must be a boolean" });
        }
        if (
          shiprocket.enabled &&
          !(vendor.integrations.shiprocket.emailEncrypted && vendor.integrations.shiprocket.passwordEncrypted)
        ) {
          return res.status(400).json({ success: false, message: "Save Shiprocket credentials before enabling the integration" });
        }
        vendor.integrations.shiprocket.enabled = shiprocket.enabled;
      }
    }

    await vendor.save();
    return res.status(200).json({
      success: true,
      message: "Vendor integrations saved",
      integrations: configurationStatus(vendor),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not save vendor integrations",
    });
  }
};