import order from "../../models/user/MyOrdersModel.js";

export const myCustomer = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const orders = await order
      .find({
        "items.vendorId": vendorId,
      })
      .populate("userId", "name email phone");

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Unique customers
    const customerMap = new Map();

    orders.forEach((order) => {
      if (!order.userId) return;

      const userId = order.userId._id.toString();

      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          userId: order.userId._id,
          name: order.userId.name,
          email: order.userId.email,
          phone: order.userId.phone,
          totalOrders: 1,
        });
      } else {
        customerMap.get(userId).totalOrders += 1;
      }
    });

    const customers = Array.from(customerMap.values());

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    // console.log("My Customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


