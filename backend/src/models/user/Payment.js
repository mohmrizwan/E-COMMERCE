import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },

  razorpay_payment_id: {
    type: String,
  },

  razorpay_signature: {
    type: String,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  amountPaise: Number,
  subtotalAmount: Number,
  shippingAmount: Number,
  finalTotal: Number,
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
      },
      name: String,
      image: String,
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  shippingCourierCompanyId: String,
  shippingCourierName: String,
  shippingPickupPostcode: String,
  shippingWeight: Number,
  estimatedDelivery: String,
  vendorShippingQuotes: [
    {
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
      pickupLocationName: { type: String, required: true },
      pickupPostcode: { type: String, required: true },
      deliveryPostcode: { type: String, required: true },
      shippingAmount: { type: Number, required: true },
      courierCompanyId: { type: String, required: true },
      courierName: String,
      estimatedDelivery: String,
      weight: Number,
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "myOrders",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("payment", paymentSchema);