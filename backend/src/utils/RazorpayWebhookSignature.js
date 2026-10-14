import crypto from "crypto";

export const verifyRazorpayWebhookSignature = ({ rawBody, signature, secret }) => {
  if (!Buffer.isBuffer(rawBody) || !signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  let provided;
  try {
    provided = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return provided.length === expected.length && crypto.timingSafeEqual(expected, provided);
};
