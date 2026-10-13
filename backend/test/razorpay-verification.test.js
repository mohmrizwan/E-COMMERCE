import test from "node:test";
import assert from "node:assert/strict";
import { confirmRazorpayPayment } from "../src/utils/RazorpayPaymentVerification.js";

const expected = {
  id: "pay_synthetic",
  order_id: "order_synthetic",
  amount: 84800,
  currency: "INR",
  status: "captured",
};

const verify = (payment, options = {}) =>
  confirmRazorpayPayment({
    paymentId: expected.id,
    orderId: expected.order_id,
    amountPaise: expected.amount,
    fetchPayment: async () => payment,
    ...options,
  });

test("accepts a captured payment matching the server-created order", async () => {
  assert.equal(await verify(expected), expected);
});

test("captures an authorized payment then requires a captured server response", async () => {
  const authorized = { ...expected, status: "authorized" };
  let fetches = 0;
  let captureArgs;
  const result = await confirmRazorpayPayment({
    paymentId: expected.id,
    orderId: expected.order_id,
    amountPaise: expected.amount,
    fetchPayment: async () => (++fetches === 1 ? authorized : expected),
    capturePayment: async (...args) => { captureArgs = args; },
  });
  assert.deepEqual(captureArgs, [expected.id, expected.amount, "INR"]);
  assert.equal(result.status, "captured");
  assert.equal(fetches, 2);
});

test("rejects wrong order, amount, and currency returned by Razorpay", async (t) => {
  for (const [name, payment] of [
    ["order", { ...expected, order_id: "order_other" }],
    ["amount", { ...expected, amount: 84799 }],
    ["currency", { ...expected, currency: "USD" }],
  ]) {
    await t.test(name, async () => {
      await assert.rejects(verify(payment), /do not match the order/);
    });
  }
});

test("rejects an authorized payment if capture does not complete", async () => {
  await assert.rejects(
    confirmRazorpayPayment({
      paymentId: expected.id,
      orderId: expected.order_id,
      amountPaise: expected.amount,
      fetchPayment: async () => ({ ...expected, status: "authorized" }),
      capturePayment: async () => {},
    }),
    /has not been captured/,
  );
});

test("accepts a capture completed by a parallel verification request", async () => {
  const authorized = { ...expected, status: "authorized" };
  let fetches = 0;
  const result = await confirmRazorpayPayment({
    paymentId: expected.id,
    orderId: expected.order_id,
    amountPaise: expected.amount,
    fetchPayment: async () => (++fetches === 1 ? authorized : expected),
    capturePayment: async () => { throw new Error("already captured"); },
  });
  assert.equal(result.status, "captured");
  assert.equal(fetches, 2);
});

test("rejects incomplete provider responses", async () => {
  await assert.rejects(verify(null), /do not match the order/);
});
