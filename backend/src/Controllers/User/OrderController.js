import order from "../../models/user/MyOrdersModel.js";
import productModel from "../../models/vendor/ProductModel.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items, shippingAddress, paymentMethod, paymentStatus } = req.body;

    // Check items
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items found",
      });
    }

    // Check shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      const itemTotal = product.pricing * item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        quantity: item.quantity,
        price: product.pricing,
      });
    }

    const newOrder = await order.create({
      userId,
      items: orderItems,
      totalAmount,
      status: "Pending",
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      shippingAddress,
    });

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
