import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../../models/user/Payment.js";
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const order = async (req, res) => {
  try {
    const { amount } = req.body;
    const option = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(option, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }

      res.status(200).json({ data: order });
      //   console.log(order);
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    const isAuthenticated = expectedSign === razorpay_signature;

    if (!isAuthenticated) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const payment = new Payment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
