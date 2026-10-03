import Razorpay from "razorpay";
import crypto from "crypto";
import productModel from "../../models/vendor/ProductModel.js";
import Payment from "../../models/user/Payment.js";
import { getShiprocketShippingQuote } from "../../Services/ShipRocket.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const order = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { items, shippingAddress } = req.body;
    const deliveryPostcode = String(shippingAddress?.pincode || "").trim();

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items found" });
    }

    if (
      !shippingAddress?.name ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !/^\d{6}$/.test(deliveryPostcode)
    ) {
      return res.status(400).json({ message: "A valid shipping address is required" });
    }

    const normalizedShippingAddress = {
      ...shippingAddress,
      pincode: deliveryPostcode,
    };

    const checkoutItems = [];
    let subtotalPaise = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid item quantity" });
      }

      const product = await productModel.findById(item.productId);
      if (!product || product.status !== "active") {
        return res.status(400).json({ message: "A cart product is unavailable" });
      }

      if (product.stockQuantity < quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      const unitPricePaise = Math.round(Number(product.pricing) * 100);
      subtotalPaise += unitPricePaise * quantity;
      checkoutItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        name: product.name,
        image: product.image,
        quantity,
        price: unitPricePaise / 100,
      });
    }

    const subtotalAmount = subtotalPaise / 100;
    const shippingQuote = await getShiprocketShippingQuote({
      deliveryPostcode,
      weight: 0.5,
      cod: 0,
      declaredValue: subtotalAmount,
    });
    const shippingPaise = Math.round(shippingQuote.shippingAmount * 100);
    const amountPaise = subtotalPaise + shippingPaise;
    const finalTotal = amountPaise / 100;
    const option = {
      amount: amountPaise,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const razorpayOrder = await razorpayInstance.orders.create(option);
    await Payment.create({
      razorpay_order_id: razorpayOrder.id,
      userId,
      amountPaise,
      subtotalAmount,
      shippingAmount: shippingPaise / 100,
      finalTotal,
      items: checkoutItems,
      shippingAddress: normalizedShippingAddress,
      shippingCourierCompanyId: shippingQuote.courierCompanyId,
      shippingCourierName: shippingQuote.courierName,
      shippingPickupPostcode: shippingQuote.pickupPostcode,
      shippingWeight: shippingQuote.weight,
      estimatedDelivery: shippingQuote.estimatedDelivery,
    });

    return res.status(201).json({
      data: razorpayOrder,
      checkout: {
        items: checkoutItems,
        subtotalAmount,
        shippingAmount: shippingPaise / 100,
        finalTotal,
        shippingCourierCompanyId: shippingQuote.courierCompanyId,
        shippingCourierName: shippingQuote.courierName,
        estimatedDelivery: shippingQuote.estimatedDelivery,
      },
    });
  } catch (error) {
    console.log("Create Razorpay Order Error:", error.response?.data || error.message);
    return res.status(error.response ? 502 : 500).json({
      message: error.message || "Could not calculate checkout total",
      error: error.response?.data,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    const isAuthenticated = expectedSign === razorpay_signature;

    if (!isAuthenticated) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      razorpay_order_id,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order was not found for this user",
      });
    }

    if (payment.paymentStatus !== "Paid") {
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.paymentStatus = "Paid";
      await payment.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
