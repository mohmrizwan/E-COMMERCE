import order from "../../models/user/MyOrdersModel.js";
import Payment from "../../models/user/Payment.js";
import productModel from "../../models/vendor/ProductModel.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ message: "Razorpay order ID is required" });
    }

    const payment = await Payment.findOne({
      razorpay_order_id,
      userId,
      paymentStatus: "Paid",
    });

    if (!payment) {
      return res.status(400).json({ message: "A verified payment is required" });
    }

    if (payment.orderId) {
      const existingOrder = await order.findById(payment.orderId);
      if (existingOrder) {
        return res.status(200).json({
          message: "Order already created for this payment",
          order: existingOrder,
        });
      }
    }

    const orderItems = [];
    const productsToUpdate = [];

    for (const item of payment.items) {
      const product = await productModel.findById(item.productId);

      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `${item.name || "A product"} is no longer available in the requested quantity`,
        });
      }

      orderItems.push({
        productId: product._id,
        vendorId: item.vendorId,
        quantity: item.quantity,
        price: item.price,
      });
      productsToUpdate.push({ product, quantity: item.quantity });
    }

    const newOrder = await order.create({
      userId,
      items: orderItems,
      subtotalAmount: payment.subtotalAmount,
      shippingAmount: payment.shippingAmount,
      totalAmount: payment.subtotalAmount,
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
    });

    for (const { product, quantity } of productsToUpdate) {
      product.stockQuantity -= quantity;
      await product.save();
    }

    payment.orderId = newOrder._id;
    await payment.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
// Get Logged-in User Orders

// Get Single Order
// export const getOrderById = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     const orderData = await order
//       .findOne({
//         _id: id,
//         userId,
//       })
//       .populate("items.productId");

//     if (!orderData) {
//       return res.status(404).json({
//         message: "Order not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Order fetched successfully",
//       order: orderData,
//     });
//   } catch (error) {
//     console.log("Get Order Error:", error);

//     return res.status(500).json({
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

// Cancel Order
// export const cancelOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     const orderData = await order.findOne({
//       _id: id,
//       userId,
//     });

//     if (!orderData) {
//       return res.status(404).json({
//         message: "Order not found",
//       });
//     }

//     if (
//       orderData.status === "Shipped" ||
//       orderData.status === "Delivered" ||
//       orderData.status === "Cancelled"
//     ) {
//       return res.status(400).json({
//         message: "Order cannot be cancelled",
//       });
//     }

//     orderData.status = "Cancelled";

//     await orderData.save();

//     return res.status(200).json({
//       message: "Order cancelled successfully",
//       order: orderData,
//     });
//   } catch (error) {
//     console.log("Cancel Order Error:", error);

//     return res.status(500).json({
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };
