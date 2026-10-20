import Razorpay from "razorpay";

export class RazorpayConfigurationError extends Error {
  constructor(message, code = "RAZORPAY_CONFIGURATION_MISSING") {
    super(message);
    this.name = "RazorpayConfigurationError";
    this.code = code;
    this.status = 503;
  }
}

export const getRazorpayCredentials = (env = process.env) => {
  const keyId = String(env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = String(env.RAZORPAY_SECRET || "");
  if (!keyId || !keySecret) {
    throw new RazorpayConfigurationError(
      "Razorpay is not configured for this deployment",
    );
  }
  return { keyId, keySecret };
};

export const createRazorpayClient = (env = process.env, RazorpayConstructor = Razorpay) => {
  const credentials = getRazorpayCredentials(env);
  return {
    client: new RazorpayConstructor({
      key_id: credentials.keyId,
      key_secret: credentials.keySecret,
    }),
    keyId: credentials.keyId,
    keySecret: credentials.keySecret,
  };
};

export const buildStandardRazorpayOrderOptions = ({ amountPaise, receipt }) => {
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
    throw new TypeError("Razorpay order amount must be a positive integer in paise");
  }
  if (typeof receipt !== "string" || !receipt) {
    throw new TypeError("Razorpay order receipt is required");
  }
  return {
    amount: amountPaise,
    currency: "INR",
    receipt,
    partial_payment: false,
  };
};

export const createStandardRazorpayOrder = (client, options) =>
  client.orders.create(buildStandardRazorpayOrderOptions(options));
