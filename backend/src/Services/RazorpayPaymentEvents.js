const allowedPaymentEvents = new Set([
  "payment.authorized",
  "payment.captured",
  "payment.failed",
]);

export class RazorpayPaymentEventError extends Error {
  constructor(message, { retryable = false } = {}) {
    super(message);
    this.name = "RazorpayPaymentEventError";
    this.retryable = retryable;
    this.status = retryable ? 503 : 400;
  }
}

/** Apply a signed payment webhook without allowing late events to undo capture. */
export const applyRazorpayPaymentEvent = async ({
  Payment,
  eventName,
  paymentEntity,
  session,
}) => {
  if (!allowedPaymentEvents.has(eventName)) {
    throw new RazorpayPaymentEventError("Unsupported Razorpay payment event");
  }

  const paymentId = String(paymentEntity?.id || "");
  const orderId = String(paymentEntity?.order_id || "");
  const amount = Number(paymentEntity?.amount);
  const currency = String(paymentEntity?.currency || "");
  const status = String(paymentEntity?.status || "");
  if (
    !paymentId ||
    !orderId ||
    !Number.isSafeInteger(amount) ||
    amount <= 0 ||
    currency !== "INR"
  ) {
    throw new RazorpayPaymentEventError("Razorpay payment event is incomplete");
  }
  if (
    (eventName === "payment.authorized" && status !== "authorized") ||
    (eventName === "payment.captured" && status !== "captured") ||
    (eventName === "payment.failed" && status !== "failed")
  ) {
    throw new RazorpayPaymentEventError("Razorpay payment event status does not match its event");
  }

  const payment = await Payment.findOne({ razorpay_order_id: orderId }).session(session);
  if (!payment) {
    throw new RazorpayPaymentEventError(
      "Razorpay payment event has no local payment record",
      { retryable: true },
    );
  }
  if (
    payment.razorpay_order_id !== orderId ||
    !Number.isSafeInteger(payment.amountPaise) ||
    payment.amountPaise !== amount
  ) {
    throw new RazorpayPaymentEventError("Razorpay payment event does not match the stored order");
  }

  // Failed attempts remain scoped to their individual Razorpay payment IDs.
  // The local order remains Pending so the customer can retry the same order.
  if (eventName !== "payment.captured") return { payment, updated: false };

  // A late capture event must never replace a different already-recorded capture.
  if (payment.paymentStatus === "Paid") {
    return {
      payment,
      updated: false,
      duplicateCapture: payment.razorpay_payment_id !== paymentId,
    };
  }

  payment.razorpay_payment_id = paymentId;
  payment.paymentStatus = "Paid";
  await payment.save({ session });
  return { payment, updated: true };
};

export const withWebhookEventIdempotency = async (runTransaction) => {
  try {
    await runTransaction();
    return { duplicate: false };
  } catch (error) {
    if (error?.code === 11000) return { duplicate: true };
    throw error;
  }
};
