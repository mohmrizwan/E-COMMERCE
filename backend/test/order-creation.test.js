import test from "node:test";
import assert from "node:assert/strict";
import { createMarketplaceOrder } from "../src/Services/MarketplaceOrderCreation.js";
import orderModel from "../src/models/user/MyOrdersModel.js";

const userId = "507f1f77bcf86cd799439012";
const productId = "507f1f77bcf86cd799439011";
const razorpayOrderId = "order_synthetic";

test("marketplace order schema has a unique Razorpay order ID index", () => {
  const razorpayOrderIndex = orderModel.schema
    .indexes()
    .find(([keys]) => keys.razorpayOrderId === 1);
  assert.equal(razorpayOrderIndex?.[1]?.unique, true);
});

const makeFixture = () => {
  const state = {
    payment: {
      _id: "507f1f77bcf86cd799439013",
      razorpay_order_id: razorpayOrderId,
      userId,
      paymentStatus: "Paid",
      orderId: null,
      items: [
        { productId, vendorId: "507f1f77bcf86cd799439014", quantity: 2, price: 799 },
        { productId, vendorId: "507f1f77bcf86cd799439014", quantity: 1, price: 799 },
      ],
      subtotalAmount: 2397,
      shippingAmount: 49,
      finalTotal: 2446,
      shippingAddress: { name: "Synthetic Buyer" },
    },
    product: {
      _id: productId,
      vendorId: "507f1f77bcf86cd799439014",
      name: "Synthetic product",
      stockQuantity: 5,
    },
    orders: [],
    nextOrderId: 1,
  };

  let transactionTail = Promise.resolve();
  const mongoose = {
    async startSession() {
      return {
        async withTransaction(callback) {
          let release;
          const previous = transactionTail;
          transactionTail = new Promise((resolve) => { release = resolve; });
          await previous;
          try { await callback(); } finally { release(); }
        },
        async endSession() {},
      };
    },
  };
  const query = (resolve) => ({ session: async () => resolve() });
  const Payment = {
    findOne: (filter) => query(async () =>
      filter.razorpay_order_id === state.payment.razorpay_order_id &&
      filter.userId === state.payment.userId &&
      filter.paymentStatus === state.payment.paymentStatus
        ? state.payment
        : null),
    updateOne: async (_filter, update) => {
      if (state.payment.orderId) return { modifiedCount: 0 };
      state.payment.orderId = update.$set.orderId;
      return { modifiedCount: 1 };
    },
  };
  const Product = {
    findById: (id) => query(async () => id === productId ? state.product : null),
    updateOne: async (filter, update) => {
      if (filter._id !== state.product._id || state.product.stockQuantity < filter.stockQuantity.$gte) {
        return { modifiedCount: 0 };
      }
      state.product.stockQuantity += update.$inc.stockQuantity;
      return { modifiedCount: 1 };
    },
  };
  const Order = {
    findById: (id) => query(async () => state.orders.find((item) => item._id === id) || null),
    async create([document]) {
      const created = { ...document, _id: `synthetic-order-${state.nextOrderId++}` };
      state.orders.push(created);
      return [created];
    },
    async findOne({ razorpayOrderId: lookupId }) {
      return state.orders.find((item) => item.razorpayOrderId === lookupId && item.userId === userId) || null;
    },
  };
  return { state, mongoose, Payment, Product, Order };
};

test("concurrent duplicate create-order requests link one order and decrement stock once", async () => {
  const fixture = makeFixture();
  const input = {
    ...fixture,
    userId,
    razorpayOrderId,
  };

  const results = await Promise.all([
    createMarketplaceOrder(input),
    createMarketplaceOrder(input),
  ]);

  assert.equal(fixture.state.orders.length, 1);
  assert.equal(fixture.state.product.stockQuantity, 2);
  assert.equal(fixture.state.payment.orderId, fixture.state.orders[0]._id);
  assert.equal(results.filter((result) => result.wasExisting).length, 1);
  assert.equal(fixture.state.orders[0].items[0].quantity, 3);
});
