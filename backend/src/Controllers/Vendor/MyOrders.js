import orderModel from "../../models/user/MyOrdersModel.js";

export const getMyOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const orders = await orderModel
      .find({
        "items.vendorId": vendorId,
      })
      .populate("items.productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Vendor orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Get Vendor Orders Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
