import Payment from "../../models/user/Payment.js";

export const getVendorTransactions = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const payments = await Payment.find({
      paymentStatus: "Paid",
      "items.vendorId": vendorId,
    })
      .populate("userId", "name email")
      .sort({ date: -1 });

    const transactions = payments.map((payment) => {
      const vendorItems = payment.items.filter(
        (item) => String(item.vendorId) === String(vendorId)
      );
      const allocation = payment.vendorAllocations?.find(
        (item) => String(item.vendorId) === String(vendorId),
      );
      const status = allocation?.settlementStatus === "settled" &&
        allocation.transferStatus === "processed"
        ? "Completed"
        : allocation?.transferStatus === "failed"
          ? "Failed"
          : "Pending";

      return {
        transactionId: payment.razorpay_payment_id,
        orderId: payment.orderId,
        customer: payment.userId?.name || "Unknown",
        paymentMethod: "Online",
        amount: allocation ? allocation.amountPaise / 100 : vendorItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
        paymentStatus: payment.paymentStatus,
        transferStatus: allocation?.transferStatus || "not_configured",
        settlementStatus: allocation?.settlementStatus || "unknown",
        status,
        date: payment.date,
      };
    });

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

