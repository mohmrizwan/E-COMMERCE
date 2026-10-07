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

  if (
    !vendor ||
    !integration?.enabled ||
    !integration.emailEncrypted ||
    !integration.passwordEncrypted
  ) {
    throw new Error("Vendor Shiprocket integration is not configured");
  }

  return {
    email: decryptCredential(integration.emailEncrypted),
    password: decryptCredential(integration.passwordEncrypted),
  };
};