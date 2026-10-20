import { assertCartStockAvailable, normalizeCartItems } from "../utils/CartValidation.js";

export class MarketplaceOrderCreationError extends Error {
  constructor(message, status = 409, code = "ORDER_CREATION_CONFLICT") {
    super(message);
    this.name = "MarketplaceOrderCreationError";
    this.status = status;
    this.code = code;
  }
}

const isTransactionUnsupported = (error) =>
  error?.code === 20 ||
  /transaction numbers are only allowed|does not support transactions/i.test(
    error?.message || "",
  );

const isDuplicateKey = (error) => error?.code === 11000;

/** Create exactly one marketplace order for a verified payment. */
export const createMarketplaceOrder = async ({
  mongoose,
  Order,
  Payment,
  Product,
  ownerId,
  userId,
  razorpayOrderId,
}) => {
  const session = await mongoose.startSession();
  let createdOrder;
  let wasExisting = false;

  try {
    await session.withTransaction(async () => {
      createdOrder = undefined;
      wasExisting = false;

      const payment = await Payment.findOne({
        razorpay_order_id: razorpayOrderId,
        userId,
        paymentStatus: "Paid",
      }).session(session);

      if (!payment) {
        throw new MarketplaceOrderCreationError(
          "A verified payment is required",
          400,
          "PAYMENT_NOT_VERIFIED",
        );
      }

      if (!ownerId) {
        throw new MarketplaceOrderCreationError(
          "Store owner is not configured",
          503,
          "STORE_OWNER_NOT_CONFIGURED",
        );
      }

      if (payment.orderId) {
        const existingOrder = await Order.findById(payment.orderId).session(session);
        if (existingOrder) {
          createdOrder = existingOrder;
          wasExisting = true;
          return;
        }
      }

      let normalizedItems;
      try {
        normalizedItems = normalizeCartItems(payment.items);
      } catch {
        throw new MarketplaceOrderCreationError(
          "The stored payment contains invalid items",
          409,
          "INVALID_PAYMENT_ITEMS",
        );
      }

      const orderItems = [];
      for (const item of normalizedItems) {
        const product = await Product.findOne({
          _id: item.productId,
          vendorId: ownerId,
          status: "active",
        }).session(session);
        if (!product) {
          throw new MarketplaceOrderCreationError(
            "A product is no longer available in this store",
            409,
            "STOCK_UNAVAILABLE",
          );
        }
        try {
          assertCartStockAvailable(product.name, item.quantity, product.stockQuantity);
        } catch {
          throw new MarketplaceOrderCreationError(
            `${product.name || "A product"} is no longer available in the requested quantity`,
            409,
            "STOCK_UNAVAILABLE",
          );
        }

        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            vendorId: ownerId,
            status: "active",
            stockQuantity: { $gte: item.quantity },
          },
          { $inc: { stockQuantity: -item.quantity } },
          { session },
        );
        if (stockUpdate.modifiedCount !== 1) {
          throw new MarketplaceOrderCreationError(
            `${product.name || "A product"} is no longer available in the requested quantity`,
            409,
            "STOCK_UNAVAILABLE",
          );
        }

        const storedItem = payment.items.find(
          (candidate) => String(candidate.productId) === item.productId,
        );
        orderItems.push({
          productId: product._id,
          vendorId: product.vendorId,
          quantity: item.quantity,
          price: storedItem.price,
        });
      }

      const [newOrder] = await Order.create(
        [{
          userId,
          items: orderItems,
          subtotalAmount: payment.subtotalAmount,
          shippingAmount: payment.shippingAmount,
          totalAmount: payment.finalTotal,
          finalTotal: payment.finalTotal,
          shippingCourierCompanyId: payment.shippingCourierCompanyId,
          shippingCourierName: payment.shippingCourierName,
          shippingPickupPostcode: payment.shippingPickupPostcode,
          shippingWeight: payment.shippingWeight,
          estimatedDelivery: payment.estimatedDelivery,
          vendorShippingQuotes: payment.vendorShippingQuotes,
          razorpayOrderId: payment.razorpay_order_id,
          status: "Pending",
          paymentMethod: "Razorpay",
          paymentStatus: "Paid",
          shippingAddress: payment.shippingAddress,
        }],
        { session },
      );

      const paymentLink = await Payment.updateOne(
        {
          _id: payment._id,
          paymentStatus: "Paid",
          $or: [{ orderId: null }, { orderId: { $exists: false } }],
        },
        { $set: { orderId: newOrder._id } },
        { session },
      );

      if (paymentLink.modifiedCount !== 1) {
        throw new MarketplaceOrderCreationError(
          "An order is already being created for this payment",
        );
      }
      createdOrder = newOrder;
    });

    return { order: createdOrder, wasExisting };
  } catch (error) {
    if (isTransactionUnsupported(error)) {
      throw new MarketplaceOrderCreationError(
        "Order creation requires a MongoDB replica set or sharded cluster",
        503,
        "TRANSACTIONS_UNAVAILABLE",
      );
    }

    if (isDuplicateKey(error)) {
      const existingOrder = await Order.findOne({
        razorpayOrderId,
        userId,
      });
      if (existingOrder) return { order: existingOrder, wasExisting: true };
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

/** Recover an order from a locally recorded captured payment, such as a webhook. */
export const createOrderForCapturedPayment = async ({
  mongoose,
  Order,
  Payment,
  Product,
  ownerId,
  razorpayOrderId,
}) => {
  const payment = await Payment.findOne({
    razorpay_order_id: razorpayOrderId,
    paymentStatus: "Paid",
  });
  if (!payment) {
    throw new MarketplaceOrderCreationError(
      "A captured payment record is required",
      409,
      "CAPTURED_PAYMENT_NOT_FOUND",
    );
  }

  return createMarketplaceOrder({
    mongoose,
    Order,
    Payment,
    Product,
    ownerId,
    userId: payment.userId,
    razorpayOrderId,
  });
};
