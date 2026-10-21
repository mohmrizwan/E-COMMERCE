import crypto from "crypto";
import productModel from "../../models/vendor/ProductModel.js";
import VendorModel from "../../models/vendor/AuthModel.js";
import Payment from "../../models/user/Payment.js";
import {
  getShiprocketPickupLocations,
  getShiprocketShippingQuote,
} from "../../Services/ShipRocket.js";
import { calculateShipmentParcel } from "../../Services/ShipmentParcel.js";
import {
  confirmRazorpayPayment,
  isVerifiedPaymentRetry,
  verifyRazorpayCheckoutSignature,
} from "../../utils/RazorpayPaymentVerification.js";
import { findStoreOwner } from "../../Services/StoreOwner.js";
import {
  createRazorpayClient,
  createStandardRazorpayOrder,
  RazorpayConfigurationError,
} from "../../Services/StandardRazorpay.js";
import {
  assertCartStockAvailable,
  normalizeCartItems,
} from "../../utils/CartValidation.js";

export const order = async (req, res) => {
  try {
    const { client: razorpayInstance, keyId } = createRazorpayClient();

    const userId = req.user.id || req.user.userId || req.user._id;
    const { items, shippingAddress } = req.body;
    const deliveryPostcode = String(shippingAddress?.pincode || "").trim();

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items found" });
    }

    let normalizedItems;
    try {
      normalizedItems = normalizeCartItems(items);
    } catch {
      return res.status(400).json({ message: "Cart items or quantities are invalid" });
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
    const storeOwner = await findStoreOwner();
    if (!storeOwner) {
      return res.status(503).json({ message: "Store owner is not configured" });
    }
    const vendorSubtotalsPaise = new Map();
    const vendorProducts = new Map();
    let subtotalPaise = 0;

    for (const item of normalizedItems) {
      const quantity = item.quantity;
      const product = await productModel.findOne({
        _id: item.productId,
        vendorId: storeOwner._id,
        status: "active",
      });
      if (!product || product.status !== "active") {
        return res.status(400).json({ message: "A cart product is unavailable" });
      }
      try {
        assertCartStockAvailable(product.name, quantity, product.stockQuantity);
      } catch {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      const discountPercent = Number(product.discount) || 0;
      const unitPrice = discountPercent > 0
        ? Math.round(Number(product.pricing) * (1 - discountPercent / 100))
        : Number(product.pricing);
      const unitPricePaise = Math.round(unitPrice * 100);
      console.info("[checkout:price]", {
        productId: String(product._id),
        productName: product.name,
        cartPrice: item.price ?? null,
        databasePricing: product.pricing,
        discountPercent,
        chargedUnitPrice: unitPricePaise / 100,
        quantity,
      });
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
      if (!vendorProducts.has(vendorId)) vendorProducts.set(vendorId, []);
      vendorProducts.get(vendorId).push({ productId: product, quantity });
      checkoutItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        name: product.name,
        image: product.image,
        quantity,
        price: unitPricePaise / 100,
        originalPrice: Number(product.pricing),
      });
    }

    const subtotalAmount = subtotalPaise / 100;
    const vendorShippingQuotes = [];
    let shippingPaise = 0;

    for (const [vendorId, vendorSubtotalPaise] of vendorSubtotalsPaise) {
      const vendor = await VendorModel.findById(vendorId).select(
        "pickupAddress businessName",
      );
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
          message: `${vendor.businessName || "This store"} must save a complete pickup address with a valid six-digit pincode and registered Shiprocket pickup location before checkout`,
        });
      }

      const registeredPickupLocations = await getShiprocketPickupLocations(
        vendor._id,
      );
      const registeredPickupLocation = registeredPickupLocations.find(
        (location) =>
          String(location.pickup_location || location.name || "").trim() ===
          pickupLocationName,
      );
      const registeredPickupPostcode = String(
        registeredPickupLocation?.pin_code ||
          registeredPickupLocation?.pincode ||
          "",
      ).trim();
      const registeredPickupAddress = String(
        registeredPickupLocation?.address ||
          registeredPickupLocation?.address_1 ||
          "",
      ).trim();
      const registeredPickupCity = String(
        registeredPickupLocation?.city || "",
      ).trim();
      const registeredPickupState = String(
        registeredPickupLocation?.state || "",
      ).trim();
      if (
        !registeredPickupLocation ||
        !registeredPickupAddress ||
        !registeredPickupCity ||
        !registeredPickupState ||
        !/^\d{6}$/.test(registeredPickupPostcode) ||
        registeredPickupPostcode !== pickupPostcode
      ) {
        return res.status(400).json({
          message: `${vendor.businessName || "This store"} must save a complete pickup address with a valid six-digit pincode and registered Shiprocket pickup location before checkout`,
        });
      }

      let parcel;
      try {
        parcel = calculateShipmentParcel(vendorProducts.get(String(vendorId)));
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
      const quote = await getShiprocketShippingQuote({
        vendorId: vendor._id,
        pickupPostcode,
        deliveryPostcode,
        ...parcel,
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
        estimatedShippingCost: vendorShippingPaise / 100,
        courierCompanyId: quote.courierCompanyId,
        courierName: quote.courierName,
        estimatedDelivery: quote.estimatedDelivery,
        weight: quote.weight,
        length: quote.length,
        breadth: quote.breadth,
        height: quote.height,
      });
    }

    const primaryQuote = vendorShippingQuotes.length === 1
      ? vendorShippingQuotes[0]
      : null;
    const amountPaise = subtotalPaise + shippingPaise;
    const finalTotal = amountPaise / 100;
    console.info("[checkout:totals]", {
      subtotal: subtotalPaise / 100,
      shipping: shippingPaise / 100,
      finalTotal,
      vendorShippingQuotes,
    });
    const razorpayOrder = await createStandardRazorpayOrder(razorpayInstance, {
      amountPaise,
      receipt: crypto.randomBytes(10).toString("hex"),
    });
    console.info("[checkout:razorpay-order]", {
      orderId: razorpayOrder.id,
      requestedAmountPaise: amountPaise,
      returnedAmountPaise: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
    if (
      !razorpayOrder?.id ||
      razorpayOrder.amount !== amountPaise ||
      razorpayOrder.currency !== "INR"
    ) {
      return res.status(502).json({ message: "Payment provider returned an invalid order" });
    }
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
      shippingWeight: primaryQuote?.weight || 0,
      estimatedDelivery: primaryQuote?.estimatedDelivery || "",
      vendorShippingQuotes,
    });

    return res.status(201).json({
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId,
      },
      checkout: {
        storeName: storeOwner.businessName,
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
    if (error instanceof RazorpayConfigurationError) {
      return res.status(error.status).json({ message: error.message, code: error.code });
    }
    console.error("Create Razorpay Order Error", {
      status: error.response?.status,
      code: error.code,
      name: error.name,
      providerCode: error.response?.data?.error?.code || null,
      providerDescription: error.response?.data?.error?.description || error.response?.data?.message || null,
    });
    return res.status(error.response ? 502 : 500).json({
      message: "Could not create a checkout payment",
    });
  }
};

export const verify = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (
      typeof razorpay_order_id !== "string" ||
      !razorpay_order_id ||
      typeof razorpay_payment_id !== "string" ||
      !razorpay_payment_id ||
      typeof razorpay_signature !== "string" ||
      !/^[a-f\d]{64}$/i.test(razorpay_signature)
    ) {
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

    const { client: razorpayInstance, keySecret } = createRazorpayClient();
    const isAuthenticated = verifyRazorpayCheckoutSignature({
      payment,
      requestOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: keySecret,
    });
    if (!isAuthenticated) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    if (isVerifiedPaymentRetry(payment, razorpay_payment_id)) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    }
    if (payment.paymentStatus === "Paid") {
      return res.status(409).json({
        success: false,
        message: "A different payment is already recorded for this order",
      });
    }

    if (
      payment.paymentStatus !== "Pending" ||
      payment.razorpay_order_id !== razorpay_order_id ||
      !Number.isSafeInteger(payment.amountPaise) ||
      payment.amountPaise <= 0
    ) {
      return res.status(409).json({
        success: false,
        message: "Payment is not eligible for verification",
      });
    }

    await confirmRazorpayPayment({
      paymentId: razorpay_payment_id,
      orderId: payment.razorpay_order_id,
      amountPaise: payment.amountPaise,
      currency: "INR",
      fetchPayment: (id) => razorpayInstance.payments.fetch(id),
      capturePayment: (id, amount, currency) =>
        razorpayInstance.payments.capture(id, amount, currency),
    });

    const update = await Payment.updateOne(
      {
        _id: payment._id,
        paymentStatus: "Pending",
        $or: [
          { razorpay_payment_id: { $exists: false } },
          { razorpay_payment_id: null },
          { razorpay_payment_id: razorpay_payment_id },
        ],
      },
      {
        $set: {
          razorpay_payment_id,
          razorpay_signature,
          paymentStatus: "Paid",
        },
      },
    );

    if (update.modifiedCount !== 1) {
      const latest = await Payment.findById(payment._id);
      if (!isVerifiedPaymentRetry(latest, razorpay_payment_id)) {
        return res.status(409).json({
          success: false,
          message: "Payment verification is already being processed",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    if (error instanceof RazorpayConfigurationError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    }
    console.error("Razorpay verification rejected", error.code || error.name);

    return res.status(error.status || 500).json({
      success: false,
      message: "Payment could not be verified",
    });
  }
};
