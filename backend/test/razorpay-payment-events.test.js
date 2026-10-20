import test from "node:test";
import assert from "node:assert/strict";
import {
  applyRazorpayPaymentEvent,
  RazorpayPaymentEventError,
  withWebhookEventIdempotency,
} from "../src/Services/RazorpayPaymentEvents.js";

const makePayment = (overrides = {}) => ({
  razorpay_order_id: "order_local",
  amountPaise: 2500,
  paymentStatus: "Pending",
  razorpay_payment_id: undefined,
  async save() { this.saved = true; },
  ...overrides,
});
const makeModel = (payment) => ({
  findOne: (query) => ({ session: async () => query.razorpay_order_id === payment.razorpay_order_id ? payment : null }),
});
const entity = (overrides = {}) => ({ id: "pay_test", order_id: "order_local", amount: 2500, currency: "INR", status: "captured", ...overrides });

test("only a captured payment event marks the local payment paid", async () => {
  const payment = makePayment();
  await applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName: "payment.authorized", paymentEntity: entity({ status: "authorized" }), session: {} });
  assert.equal(payment.paymentStatus, "Pending");
  await applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName: "payment.failed", paymentEntity: entity({ status: "failed" }), session: {} });
  assert.equal(payment.paymentStatus, "Pending");
  const result = await applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName: "payment.captured", paymentEntity: entity(), session: {} });
  assert.equal(result.updated, true);
  assert.equal(payment.paymentStatus, "Paid");
  assert.equal(payment.razorpay_payment_id, "pay_test");
  assert.equal(payment.saved, true);
});

test("payment webhook validates order, amount, currency, and event status", async () => {
  const payment = makePayment();
  const run = (eventName, paymentEntity) => applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName, paymentEntity, session: {} });
  await assert.rejects(run("payment.captured", entity({ amount: 2400 })), RazorpayPaymentEventError);
  await assert.rejects(run("payment.captured", entity({ currency: "USD" })), RazorpayPaymentEventError);
  await assert.rejects(run("payment.captured", entity({ status: "authorized" })), RazorpayPaymentEventError);
  await assert.rejects(run("payment.captured", entity({ order_id: "order_other" })), RazorpayPaymentEventError);
});

test("duplicate and late events cannot downgrade or replace an existing capture", async () => {
  const payment = makePayment({ paymentStatus: "Paid", razorpay_payment_id: "pay_original" });
  const result = await applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName: "payment.captured", paymentEntity: entity({ id: "pay_other" }), session: {} });
  assert.equal(result.updated, false);
  assert.equal(result.duplicateCapture, true);
  assert.equal(payment.razorpay_payment_id, "pay_original");
  await applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName: "payment.failed", paymentEntity: entity({ id: "pay_original", status: "failed" }), session: {} });
  assert.equal(payment.paymentStatus, "Paid");
});

test("webhook event idempotency treats duplicate event records as already handled", async () => {
  const result = await withWebhookEventIdempotency(async () => { throw Object.assign(new Error("duplicate"), { code: 11000 }); });
  assert.deepEqual(result, { duplicate: true });
});

test("captured historical Route payment data remains intact", async () => {
  const historicalAllocation = { linkedAccountId: "account_historical", transferId: "tr_historical", amountPaise: 2500 };
  const payment = makePayment({ paymentStatus: "Paid", razorpay_payment_id: "pay_historical", vendorAllocations: [historicalAllocation] });
  const result = await applyRazorpayPaymentEvent({ Payment: makeModel(payment), eventName: "payment.captured", paymentEntity: entity({ id: "pay_historical" }), session: {} });
  assert.equal(result.updated, false);
  assert.deepEqual(payment.vendorAllocations, [historicalAllocation]);
});
