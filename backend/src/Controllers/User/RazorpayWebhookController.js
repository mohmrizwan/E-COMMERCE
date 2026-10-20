import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../../models/user/Payment.js";
import Order from "../../models/user/MyOrdersModel.js";
import Product from "../../models/vendor/ProductModel.js";
import RazorpayWebhookEvent from "../../models/user/RazorpayWebhookEvent.js";
import { getRouteTransfersForSettlement } from "../../Services/RazorpayRoute.js";
import { findStoreOwner } from "../../Services/StoreOwner.js";
import { createOrderForCapturedPayment } from "../../Services/MarketplaceOrderCreation.js";
import { verifyRazorpayWebhookSignature } from "../../utils/RazorpayWebhookSignature.js";
import {
  applyRazorpayPaymentEvent,
  RazorpayPaymentEventError,
  withWebhookEventIdempotency,
} from "../../Services/RazorpayPaymentEvents.js";

const isDuplicateKey = (error) => error?.code === 11000;

const applyTransferSnapshot = async (transfer, session) => {
  const orderId = String(transfer?.source || "");
  const transferId = String(transfer?.id || "");
  const recipient = String(transfer?.recipient || "");
  const amountPaise = Number(transfer?.amount);
  const currency = String(transfer?.currency || "");
  if (!orderId || !transferId || !recipient || currency !== "INR" || !Number.isSafeInteger(amountPaise)) {
    throw new Error("Razorpay Route transfer event is incomplete");
  }

  const payment = await Payment.findOne({ razorpay_order_id: orderId }).session(session);
  if (!payment) throw new Error("Razorpay Route transfer has no local payment record");
  const allocation = payment.vendorAllocations.find((item) =>
    item.transferId === transferId &&
    item.linkedAccountId === recipient &&
    item.amountPaise === amountPaise,
  );
  if (!allocation) throw new Error("Razorpay Route transfer does not match a stored vendor allocation");

  const incomingStatus = String(transfer.status || transfer.transfer_status || "");
  const currentStatus = allocation.transferStatus;
  if (incomingStatus === "processed") {
    allocation.transferStatus = "processed";
  } else if (incomingStatus === "failed" && currentStatus !== "processed") {
    allocation.transferStatus = "failed";
  }
  if (transfer.settlement_status === "settled") {
    allocation.settlementStatus = "settled";
  } else if (transfer.settlement_status === "on_hold" && allocation.settlementStatus !== "settled") {
    allocation.settlementStatus = "on_hold";
  }
  if (Number.isSafeInteger(Number(transfer.amount_reversed))) {
    allocation.amountReversedPaise = Number(transfer.amount_reversed);
  }
  allocation.updatedAt = new Date();
  await payment.save({ session });
};

export const handleRazorpayWebhook = async (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!verifyRazorpayWebhookSignature({ rawBody, signature, secret })) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ message: "Invalid webhook payload" });
  }

  const eventName = String(payload?.event || "");
  const paymentEvents = new Set([
    "payment.authorized",
    "payment.captured",
    "payment.failed",
  ]);
  const transferEvents = new Set(["transfer.processed", "transfer.failed", "settlement.processed"]);
  const relevant = new Set([...paymentEvents, ...transferEvents]);
  if (!relevant.has(eventName)) return res.sendStatus(200);

  const eventId = req.get("x-razorpay-event-id") ||
    crypto.createHash("sha256").update(rawBody).digest("hex");
  let transfers = [];
  let paymentEntity;
  if (eventName === "settlement.processed") {
    const settlementId = String(payload?.payload?.settlement?.entity?.id || "");
    if (!settlementId) return res.status(400).json({ message: "Settlement event is incomplete" });
    try {
      transfers = await getRouteTransfersForSettlement(settlementId);
    } catch (error) {
      console.error("Razorpay Route settlement reconciliation fetch failed", {
        status: error.response?.status,
        code: error.code,
      });
      return res.status(503).json({ message: "Settlement reconciliation will be retried" });
    }
  } else if (transferEvents.has(eventName)) {
    const transfer = payload?.payload?.transfer?.entity;
    if (!transfer) return res.status(400).json({ message: "Transfer event is incomplete" });
    transfers = [transfer];
  } else {
    paymentEntity = payload?.payload?.payment?.entity;
    if (!paymentEntity) return res.status(400).json({ message: "Payment event is incomplete" });
  }

  const session = await mongoose.startSession();
  try {
    await withWebhookEventIdempotency(() => session.withTransaction(async () => {
      await RazorpayWebhookEvent.create([{ eventId, event: eventName }], { session });
      if (paymentEvents.has(eventName)) {
        await applyRazorpayPaymentEvent({
          Payment,
          eventName,
          paymentEntity,
          session,
        });
      } else {
        for (const transfer of transfers) await applyTransferSnapshot(transfer, session);
      }
      await RazorpayWebhookEvent.updateOne(
        { eventId },
        { $set: { processedAt: new Date() } },
        { session },
      );
    }));
    if (eventName === "payment.captured") {
      const owner = await findStoreOwner();
      if (!owner) throw new Error("Configured store owner could not be resolved");
      await createOrderForCapturedPayment({
        mongoose,
        Order,
        Payment,
        Product,
        ownerId: owner._id,
        razorpayOrderId: String(paymentEntity.order_id),
      });
    }
    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof RazorpayPaymentEventError) {
      return res.status(error.status).json({ message: error.message });
    }
    if (isDuplicateKey(error)) return res.sendStatus(200);
    console.error("Razorpay Route webhook processing failed", {
      event: eventName,
      eventId,
      errorName: error.name || "Error",
      errorCode: error.code,
    });
    return res.status(503).json({ message: "Webhook processing will be retried" });
  } finally {
    await session.endSession();
  }
};
