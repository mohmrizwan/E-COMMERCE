import mongoose from "mongoose";
import order from "../../models/user/MyOrdersModel.js";
import Product from "../../models/vendor/ProductModel.js";
import ShipOrder from "../../models/Shiprocket/ShipOrder.js";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dashboardOrderStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getVendorShipmentStatus = (shipment) => {
  if (!shipment) return "Pending";

  switch (shipment.status) {
    case "AWB_ASSIGNED":
      return "Confirmed";
    case "PROCESSING":
      return "Processing";
    case "PICKUP_REQUESTED":
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    default:
      return shipment.awbCode ? "Confirmed" : "Pending";
  }
};

export const getVendorIncome = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    if (!vendorId) {
      return res
        .status(404)
        .json({ message: "You have permission for this action" });
    }

    const findOrders = await order.find({
      "items.vendorId": vendorId,
    });

    let totalIncome = 0;
    const monthlyIncome = {};

    for (const orders of findOrders) {
      const month = orders.createdAt.toLocaleString("en-US", {
        month: "long",
      });

      for (const item of orders.items) {
        if (item.vendorId.toString() === vendorId.toString()) {
          const itemIncome = item.price * item.quantity;

          totalIncome += itemIncome;

          monthlyIncome[month] = (monthlyIncome[month] || 0) + itemIncome;
        }
      }
    }

    const monthlyIncomeArray = Object.entries(monthlyIncome).map(
      ([month, income]) => ({
        month,
        income,
      }),
    );

    return res.status(200).json({
      totalIncome,
      monthlyIncome: monthlyIncomeArray,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getVendorOrdersCount = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const findOrders = await order.find({
      "items.vendorId": vendorId,
    });
    let ordersCount = 0;
    const monthlyOrderData = {};

    for (const orders of findOrders) {
      const month = orders.createdAt.toLocaleString("en-US", {
        month: "long",
      });

      ordersCount += 1;

      monthlyOrderData[month] = (monthlyOrderData[month] || 0) + 1;
    }

    const monthlyOrders = months.map((month) => ({
      month,
      orders: monthlyOrderData[month] || 0,
    }));

    return res.status(200).json({
      ordersCount,
      monthlyOrders,
    });
  } catch (error) {
    console.log("Get Vendor Orders Count Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getVendorProductsCount = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const [productsCount, productsByMonth] = await Promise.all([
      Product.countDocuments({ vendorId }),
      Product.aggregate([
        { $match: { vendorId: vendorObjectId } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            products: { $sum: 1 },
          },
        },
      ]),
    ]);
    const monthlyProductCounts = new Map(
      productsByMonth.map(({ _id, products }) => [_id, products]),
    );

    return res.status(200).json({
      productsCount,
      monthlyProducts: months.map((month, index) => ({
        month,
        products: monthlyProductCounts.get(index + 1) || 0,
      })),
    });
  } catch (error) {
    console.log("Get Vendor Products Count Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getVendorCustomersCount = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const customersByFirstPurchase = await order.aggregate([
      { $match: { "items.vendorId": vendorObjectId } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$userId",
          firstPurchase: { $first: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { $month: "$firstPurchase" },
          customers: { $sum: 1 },
        },
      },
    ]);
    const monthlyCustomerCounts = new Map(
      customersByFirstPurchase.map(({ _id, customers }) => [_id, customers]),
    );

    return res.status(200).json({
      customersCount: customersByFirstPurchase.reduce(
        (count, entry) => count + entry.customers,
        0,
      ),
      monthlyCustomers: months.map((month, index) => ({
        month,
        customers: monthlyCustomerCounts.get(index + 1) || 0,
      })),
    });
  } catch (error) {
    console.log("Get Vendor Customers Count Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getVendorOrderStatusSummary = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendorOrders = await order
      .find({ "items.vendorId": vendorId })
      .select("status");
    const shipments = await ShipOrder.find({
      vendorId,
      orderId: { $in: vendorOrders.map((vendorOrder) => vendorOrder._id) },
    }).select("orderId status awbCode");
    const shipmentByOrderId = new Map(
      shipments.map((shipment) => [
        shipment.orderId.toString(),
        shipment,
      ]),
    );
    const counts = new Map(dashboardOrderStatuses.map((status) => [status, 0]));

    for (const vendorOrder of vendorOrders) {
      const status = vendorOrder.status === "Cancelled"
        ? "Cancelled"
        : getVendorShipmentStatus(
            shipmentByOrderId.get(vendorOrder._id.toString()),
          );
      counts.set(status, (counts.get(status) || 0) + 1);
    }

    return res.status(200).json({
      ordersByStatus: dashboardOrderStatuses.map((status) => ({
        status,
        orders: counts.get(status),
      })),
    });
  } catch (error) {
    console.log("Get Vendor Order Status Summary Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getVendorRecentOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendorOrders = await order
      .find({ "items.vendorId": vendorId })
      .populate("userId", "name")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    const shipments = await ShipOrder.find({
      vendorId,
      orderId: { $in: vendorOrders.map((vendorOrder) => vendorOrder._id) },
    }).select("orderId status awbCode");
    const shipmentByOrderId = new Map(
      shipments.map((shipment) => [
        shipment.orderId.toString(),
        shipment,
      ]),
    );

    const recentOrders = vendorOrders.map((vendorOrder) => {
      const vendorItems = vendorOrder.items.filter(
        (item) => item.vendorId.toString() === vendorId.toString(),
      );

      return {
        id: vendorOrder._id.toString(),
        customer: vendorOrder.userId?.name || "Customer",
        product: vendorItems
          .map((item) => item.productId?.name || "Product")
          .join(", "),
        amount: vendorItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
        status: vendorOrder.status === "Cancelled"
          ? "Cancelled"
          : getVendorShipmentStatus(
              shipmentByOrderId.get(vendorOrder._id.toString()),
            ),
        date: vendorOrder.createdAt,
      };
    });

    return res.status(200).json({ recentOrders });
  } catch (error) {
    console.log("Get Vendor Recent Orders Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getVendorRecentCustomers = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendorOrders = await order
      .find({ "items.vendorId": vendorId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    const customersById = new Map();

    for (const vendorOrder of vendorOrders) {
      const user = vendorOrder.userId;
      if (!user) continue;

      const userId = user._id.toString();
      const vendorItems = vendorOrder.items.filter(
        (item) => item.vendorId.toString() === vendorId.toString(),
      );
      const existingCustomer = customersById.get(userId);

      if (existingCustomer) {
        existingCustomer.orders += 1;
        existingCustomer.spent += vendorItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      } else {
        customersById.set(userId, {
          id: userId,
          name: user.name,
          email: user.email,
          orders: 1,
          spent: vendorItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
          lastPurchase: vendorOrder.createdAt,
          joined: vendorOrder.createdAt,
        });
      }

      const customer = customersById.get(userId);
      if (vendorOrder.createdAt < customer.joined) {
        customer.joined = vendorOrder.createdAt;
      }
    }

    const activeSince = new Date();
    activeSince.setDate(activeSince.getDate() - 90);
    const recentCustomers = [...customersById.values()]
      .sort((left, right) => right.lastPurchase - left.lastPurchase)
      .slice(0, 5)
      .map((customer) => ({
        ...customer,
        status: customer.lastPurchase >= activeSince ? "Active" : "Inactive",
      }));

    return res.status(200).json({ recentCustomers });
  } catch (error) {
    console.log("Get Vendor Recent Customers Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getVendorProductCategories = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const categories = await Product.aggregate([
      { $match: { vendorId: vendorObjectId } },
      {
        $group: {
          _id: "$category",
          products: { $sum: 1 },
        },
      },
      { $sort: { products: -1, _id: 1 } },
    ]);

    return res.status(200).json({
      categories: categories.map(({ _id, products }) => ({
        category: _id,
        products,
      })),
    });
  } catch (error) {
    console.log("Get Vendor Product Categories Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
