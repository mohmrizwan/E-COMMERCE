import { getShiprocketEnvironmentCredentials } from "./ShiprocketCredentials.js";
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

export const getVendorShippingConfig = async () => {
  const credentials = getShiprocketEnvironmentCredentials();
  if (!credentials) {
    throw new Error("SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD must be configured in the backend environment");
  }
  return credentials;
};
