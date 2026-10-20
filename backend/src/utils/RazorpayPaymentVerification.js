import crypto from "crypto";

export const verifyRazorpayCheckoutSignature = ({
  payment,
  requestOrderId,
  paymentId,
  signature,
  secret,
}) => {
  const storedOrderId = String(payment?.razorpay_order_id || "");
  if (
    !storedOrderId ||
    requestOrderId !== storedOrderId ||
    typeof paymentId !== "string" ||
    !paymentId ||
    typeof signature !== "string" ||
    !/^[a-f\d]{64}$/i.test(signature) ||
    typeof secret !== "string" ||
    !secret
  ) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${storedOrderId}|${paymentId}`)
    .digest();
  const provided = Buffer.from(signature, "hex");
  return provided.length === expected.length && crypto.timingSafeEqual(expected, provided);
};

export const isVerifiedPaymentRetry = (payment, paymentId) =>
  payment?.paymentStatus === "Paid" && payment.razorpay_payment_id === paymentId;

const paymentMatchesExpectedOrder = (payment, expected) =>
  payment &&
  payment.id === expected.paymentId &&
  payment.order_id === expected.orderId &&
  Number.isSafeInteger(payment.amount) &&
  payment.amount === expected.amountPaise &&
  payment.currency === expected.currency;

export class RazorpayPaymentVerificationError extends Error {
  constructor(message, code = "RAZORPAY_PAYMENT_INVALID", status = 400) {
    super(message);
    this.name = "RazorpayPaymentVerificationError";
    this.code = code;
    this.status = status;
  }
}

/** Fetch, validate, and if needed capture a Razorpay payment before accepting it. */
export const confirmRazorpayPayment = async ({
  paymentId,
  orderId,
  amountPaise,
  currency = "INR",
  fetchPayment,
  capturePayment,
}) => {
  if (
    typeof paymentId !== "string" ||
    !paymentId ||
    typeof orderId !== "string" ||
    !orderId ||
    !Number.isSafeInteger(amountPaise) ||
    amountPaise <= 0 ||
    typeof fetchPayment !== "function"
  ) {
    throw new RazorpayPaymentVerificationError("Payment details are incomplete");
  }

  const expected = { paymentId, orderId, amountPaise, currency };
  const fetchTrustedPayment = async () => {
    try {
      return await fetchPayment(paymentId);
    } catch {
      throw new RazorpayPaymentVerificationError(
        "Payment provider could not be reached",
        "RAZORPAY_PROVIDER_UNAVAILABLE",
        502,
      );
    }
  };
  let payment = await fetchTrustedPayment();

  if (!paymentMatchesExpectedOrder(payment, expected)) {
    throw new RazorpayPaymentVerificationError("Payment details do not match the order");
  }

  if (payment.status === "authorized") {
    if (typeof capturePayment !== "function") {
      throw new RazorpayPaymentVerificationError("Payment is authorized but not captured");
    }

    try {
      await capturePayment(paymentId, amountPaise, currency);
    } catch {
      // A parallel verification request may have completed the capture first.
      payment = await fetchTrustedPayment();
      if (
        paymentMatchesExpectedOrder(payment, expected) &&
        (payment.status === "captured" || payment.status === "paid")
      ) {
        return payment;
      }
      throw new RazorpayPaymentVerificationError(
        "Payment provider could not confirm capture",
        "RAZORPAY_PROVIDER_UNAVAILABLE",
        502,
      );
    }
    payment = await fetchTrustedPayment();

    if (!paymentMatchesExpectedOrder(payment, expected)) {
      throw new RazorpayPaymentVerificationError("Captured payment details do not match the order");
    }
  }

  if (payment.status !== "captured" && payment.status !== "paid") {
    throw new RazorpayPaymentVerificationError("Payment has not been captured");
  }

  return payment;
};
