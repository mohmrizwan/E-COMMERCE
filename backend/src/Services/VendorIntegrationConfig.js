import VendorModel from "../models/vendor/AuthModel.js";
import { decryptCredential } from "../utils/credentialEncryption.js";
export const getVendorPaymentConfig = async (vendorId) => {
  const vendor = await VendorModel.findById(vendorId).select(
    "integrations.razorpay",
  );
  const integration = vendor?.integrations?.razorpay;

  if (!vendor || !integration?.enabled || !integration.linkedAccountId) {
    throw new Error("Vendor Razorpay Route linked account is not configured");
  }

  return { linkedAccountId: integration.linkedAccountId };
};

export const getVendorShippingConfig = async (vendorId) => {
  const vendor = await VendorModel.findById(vendorId).select(
    "+integrations.shiprocket.emailEncrypted +integrations.shiprocket.passwordEncrypted",
  );
  const integration = vendor?.integrations?.shiprocket;
  const missingConfiguration = [];

  if (!vendor) missingConfiguration.push("vendor_record");
  if (vendor && !integration?.enabled) missingConfiguration.push("integration_disabled");
  if (vendor && !integration?.emailEncrypted) missingConfiguration.push("encrypted_email_missing");
  if (vendor && !integration?.passwordEncrypted) missingConfiguration.push("encrypted_password_missing");

  if (missingConfiguration.length) {
    console.error("Vendor Shiprocket configuration is incomplete", {
      vendorId: String(vendorId || ""),
      missingConfiguration,
    });
    throw new Error("Vendor Shiprocket integration is not configured");
  }

  try {
    return {
      email: decryptCredential(integration.emailEncrypted),
      password: decryptCredential(integration.passwordEncrypted),
    };
  } catch (error) {
    const encryptionKey = process.env.INTEGRATION_ENCRYPTION_KEY || "";
    console.error("Vendor Shiprocket credentials could not be decrypted", {
      vendorId: String(vendorId || ""),
      errorName: error.name || "Error",
      encryptionKeyConfigured: Boolean(encryptionKey),
      encryptionKeyFormatValid: /^[0-9a-fA-F]{64}$/.test(encryptionKey),
    });
    throw error;
  }
};
