import Razorpay from "razorpay";
import crypto from "crypto";
import productModel from "../../models/vendor/ProductModel.js";
import VendorModel from "../../models/vendor/AuthModel.js";
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
    const vendorSubtotalsPaise = new Map();
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
      const vendorId = String(product.vendorId || "");
      if (!vendorId) {
        return res.status(400).json({
          message: "A cart product is missing its vendor",
        });
      }
      vendorSubtotalsPaise.set(
        vendorId,
        (vendorSubtotalsPaise.get(vendorId) || 0) + unitPricePaise * quantity,
      );
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
    const vendorShippingQuotes = [];
    let shippingPaise = 0;

    for (const [vendorId, vendorSubtotalPaise] of vendorSubtotalsPaise) {
      const vendor = await VendorModel.findById(vendorId).select("pickupAddress");
      const pickupAddress = vendor?.pickupAddress;
      const pickupPostcode = String(pickupAddress?.pincode || "").trim();
      const pickupLocationName = String(
        pickupAddress?.shiprocketLocationName || "",
      ).trim();

      if (!vendor) {
        return res.status(400).json({
          message: "A vendor for this cart could not be found",
        });
      }

      if (
        !pickupLocationName ||
        !pickupAddress?.address ||
        !pickupAddress?.city ||
        !pickupAddress?.state ||
        !/^\d{6}$/.test(pickupPostcode)
      ) {
        return res.status(400).json({
          message: `${vendor.businessName} must save a complete pickup address with a valid six-digit pincode and registered Shiprocket pickup location before checkout`,
        });
      }

      const quote = await getShiprocketShippingQuote({
        pickupPostcode,
        deliveryPostcode,
        weight: 0.5,
        cod: 0,
        declaredValue: vendorSubtotalPaise / 100,
      });
      const vendorShippingPaise = Math.round(quote.shippingAmount * 100);
      shippingPaise += vendorShippingPaise;
      vendorShippingQuotes.push({
        vendorId: vendor._id,
        pickupLocationName,
        pickupPostcode,
        deliveryPostcode,
        shippingAmount: vendorShippingPaise / 100,
        courierCompanyId: quote.courierCompanyId,
        courierName: quote.courierName,
        estimatedDelivery: quote.estimatedDelivery,
        weight: quote.weight,
      });
    }

    const primaryQuote = vendorShippingQuotes.length === 1
      ? vendorShippingQuotes[0]
      : null;
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
      shippingCourierCompanyId: vendorShippingQuotes[0]?.courierCompanyId || "",
      shippingCourierName: primaryQuote?.courierName || "",
      shippingPickupPostcode: primaryQuote?.pickupPostcode || "",
      shippingWeight: primaryQuote?.weight || 0.5,
      estimatedDelivery: primaryQuote?.estimatedDelivery || "",
      vendorShippingQuotes,
    });

    return res.status(201).json({
      data: razorpayOrder,
      checkout: {
        items: checkoutItems,
        subtotalAmount,
        shippingAmount: shippingPaise / 100,
        finalTotal,
        shippingCourierCompanyId: vendorShippingQuotes[0]?.courierCompanyId || "",
        shippingCourierName: primaryQuote?.courierName || "",
        estimatedDelivery: primaryQuote?.estimatedDelivery || "",
        vendorShippingQuotes,
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
