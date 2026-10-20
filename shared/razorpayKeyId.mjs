export const resolveRazorpayKeyId = ({ backendKeyId, frontendKeyId } = {}) => {
  const backendKey = String(backendKeyId || "").trim();
  const frontendKey = String(frontendKeyId || "").trim();

  if (!backendKey) {
    throw new Error("Razorpay public Key ID is not configured on the backend");
  }
  if (frontendKey && frontendKey !== backendKey) {
    throw new Error("Frontend and backend Razorpay Key IDs do not match");
  }

  return backendKey;
};
