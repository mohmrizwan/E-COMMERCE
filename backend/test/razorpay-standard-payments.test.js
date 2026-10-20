import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  buildStandardRazorpayOrderOptions,
  createRazorpayClient,
  createStandardRazorpayOrder,
  getRazorpayCredentials,
} from "../src/Services/StandardRazorpay.js";
import {
  isVerifiedPaymentRetry,
  verifyRazorpayCheckoutSignature,
} from "../src/utils/RazorpayPaymentVerification.js";
import { resolveRazorpayKeyId } from "../../shared/razorpayKeyId.mjs";

test("standard order creation sends a normal INR order without Route transfers", async () => {
  const calls = [];
  const client = { orders: { create: async (options) => { calls.push(options); return { id: "order_test" }; } } };
  const result = await createStandardRazorpayOrder(client, { amountPaise: 12500, receipt: "receipt-test" });
  assert.equal(result.id, "order_test");
  assert.deepEqual(calls, [{ amount: 12500, currency: "INR", receipt: "receipt-test", partial_payment: false }]);
  assert.equal(Object.hasOwn(calls[0], "transfers"), false);
});

test("checkout order helper does not require the Route feature flag", async (t) => {
  const original = process.env.RAZORPAY_ROUTE_ENABLED;
  delete process.env.RAZORPAY_ROUTE_ENABLED;
  t.after(() => {
    if (original === undefined) delete process.env.RAZORPAY_ROUTE_ENABLED;
    else process.env.RAZORPAY_ROUTE_ENABLED = original;
  });
  let called = false;
  await createStandardRazorpayOrder({ orders: { create: async () => { called = true; return {}; } } }, { amountPaise: 100, receipt: "test" });
  assert.equal(called, true);
});

test("backend credentials are required and only the public Key ID can be resolved by the client", () => {
  assert.throws(() => getRazorpayCredentials({}), /not configured/);
  const credentials = getRazorpayCredentials({ RAZORPAY_KEY_ID: "public-key", RAZORPAY_SECRET: "test-secret" });
  assert.deepEqual(credentials, { keyId: "public-key", keySecret: "test-secret" });
  assert.equal(resolveRazorpayKeyId({ backendKeyId: credentials.keyId }), "public-key");
  assert.equal(resolveRazorpayKeyId({ backendKeyId: "public-key", frontendKeyId: "public-key" }), "public-key");
  assert.throws(() => resolveRazorpayKeyId({ backendKeyId: "public-key", frontendKeyId: "different-key" }), /do not match/);
  assert.throws(() => resolveRazorpayKeyId({ frontendKeyId: "public-key" }), /not configured/);
});

test("Razorpay SDK receives backend credentials without exposing them in public key resolution", () => {
  class FakeRazorpay {
    constructor(options) { this.options = options; }
  }
  const result = createRazorpayClient({ RAZORPAY_KEY_ID: "public-key", RAZORPAY_SECRET: "server-only-test-secret" }, FakeRazorpay);
  assert.deepEqual(result.client.options, { key_id: "public-key", key_secret: "server-only-test-secret" });
  assert.equal(result.keyId, "public-key");
  assert.equal(resolveRazorpayKeyId({ backendKeyId: result.keyId }), "public-key");
});

test("checkout signature uses the server-stored Razorpay order ID", () => {
  const payment = { razorpay_order_id: "order_from_database" };
  const paymentId = "pay_test";
  const secret = "server-only-test-secret";
  const signature = crypto.createHmac("sha256", secret).update(`${payment.razorpay_order_id}|${paymentId}`).digest("hex");
  assert.equal(verifyRazorpayCheckoutSignature({ payment, requestOrderId: payment.razorpay_order_id, paymentId, signature, secret }), true);
  assert.equal(verifyRazorpayCheckoutSignature({ payment, requestOrderId: "order_attacker", paymentId, signature, secret }), false);
  assert.equal(isVerifiedPaymentRetry({ paymentStatus: "Paid", razorpay_payment_id: paymentId }, paymentId), true);
  assert.equal(isVerifiedPaymentRetry({ paymentStatus: "Paid", razorpay_payment_id: "another" }, paymentId), false);
});

test("Razorpay order options validate paise and receipt", () => {
  assert.throws(() => buildStandardRazorpayOrderOptions({ amountPaise: 0, receipt: "test" }), /positive integer/);
  assert.throws(() => buildStandardRazorpayOrderOptions({ amountPaise: 100, receipt: "" }), /receipt is required/);
});
