const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const VENDOR_AUTH_PATH = "/vendor/auth";

const request = async (endpoint, payload) => {
  const response = await fetch(`${API_BASE_URL}${VENDOR_AUTH_PATH}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
};

export const vendorAuthApi = {
  login: (payload) => request("/login", payload),
  signup: (payload) => request("/signup", payload),
  verifyOtp: (payload) => request("/verify-otp", payload),
  resendOtp: (payload) => request("/resend-otp", payload),
};