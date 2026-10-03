import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    totalAmount: {
      type: Number,
      required: true,
    },

    subtotalAmount: {
      type: Number,
      required: true,
    },

    shippingAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    finalTotal: {
      type: Number,
      required: true,
    },

    shippingCourierCompanyId: {
      type: String,
      default: "",
    },

    shippingCourierName: {
      type: String,
      default: "",
    },

    shippingPickupPostcode: {
      type: String,
      default: "",
    },

    shippingWeight: {
      type: Number,
      default: 0.5,
    },

    estimatedDelivery: {
      type: String,
      default: "",
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true },
);

const order = mongoose.model("myOrders", OrderSchema);

export default order;
