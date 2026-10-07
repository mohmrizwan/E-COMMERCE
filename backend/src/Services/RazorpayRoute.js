import axios from "axios";

const razorpayBaseUrl = "https://api.razorpay.com/v2";

const getPlatformCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Platform Razorpay credentials are not configured");
  }

  return { username: keyId, password: keySecret };
};

export const createRouteLinkedAccount = async (payload, idempotencyKey) => {
  const response = await axios.post(
    `${razorpayBaseUrl}/accounts`,
    payload,
    {
      auth: getPlatformCredentials(),
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      timeout: 20000,
    },
  );

  return response.data;
};

export const getRouteLinkedAccount = async (accountId) => {
  const response = await axios.get(
    `${razorpayBaseUrl}/accounts/${encodeURIComponent(accountId)}`,
    { auth: getPlatformCredentials(), timeout: 15000 },
  );

  return response.data;
};

export const getRouteProductConfig = async (accountId, productConfigId) => {
  const response = await axios.get(
    `${razorpayBaseUrl}/accounts/${encodeURIComponent(accountId)}/products/${encodeURIComponent(productConfigId)}`,
    { auth: getPlatformCredentials(), timeout: 15000 },
  );

  return response.data;
};