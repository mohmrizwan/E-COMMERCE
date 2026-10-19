import mongoose from "mongoose";
import order from "../../models/user/MyOrdersModel.js";
import Payment from "../../models/user/Payment.js";
import productModel from "../../models/vendor/ProductModel.js";
import { createMarketplaceOrder } from "../../Services/MarketplaceOrderCreation.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { razorpay_order_id } = req.body;

    if (typeof razorpay_order_id !== "string" || !razorpay_order_id) {
      return res.status(400).json({ message: "Razorpay order ID is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "Login required" });
    }
    const result = await createMarketplaceOrder({
      mongoose,
      Order: order,
      Payment,
      Product: productModel,
      userId,
      razorpayOrderId: razorpay_order_id,
    });

    return res.status(result.wasExisting ? 200 : 201).json({
      message: result.wasExisting
        ? "Order already created for this payment"
        : "Order created successfully",
      order: result.order,
    });
  } catch (error) {
    console.error("Create Order Error:", error.code || error.name);

    return res.status(error.status || 500).json({
      message: error.message || "Something went wrong",
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
