import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../Components/CartContext";
import CheckoutAddress from "../Components/Checkout.jsx/Address";
import Payment from "../Components/Checkout.jsx/Payment";
import Confirmation from "../Components/Checkout.jsx/Confirmation";

const API_URL = "https://ecommerceba-6dtt.onrender.com";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const { cart: contextCart, removeFromCart } = useCart();
  const cart = Array.isArray(contextCart) ? contextCart : [];

  const continueToPayment = async (address) => {
    setIsContinuing(true);
    setCheckoutError("");

    try {
      const response = await axios.post(
        `${API_URL}/payment/get-payment`,
        {
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity || 1),
          })),
          shippingAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      const checkout = response.data.checkout;
      const items = checkout.items.map((item) => {
        const cartItem = cart.find(
          (current) => String(current.productId) === String(item.productId),
        );
        return {
          ...item,
          originalPrice: item.price,
          image: item.image || cartItem?.image || "",
        };
      });

      setOrderData({
        items,
        address,
        subtotal: checkout.subtotalAmount,
        discount: 0,
        shipping: checkout.shippingAmount,
        total: checkout.finalTotal,
        shippingCourierCompanyId: checkout.shippingCourierCompanyId,
        shippingCourierName: checkout.shippingCourierName,
        estimatedDelivery: checkout.estimatedDelivery,
        razorpayOrder: response.data.data,
      });
      setStep(2);
    } catch (error) {
      setCheckoutError(
        error.response?.data?.message ||
          "Could not calculate delivery charge. Please check the address and try again.",
      );
    } finally {
      setIsContinuing(false);
    }
  };

  const placeOrder = (createdOrder) => {
    setOrderData((current) => ({
      ...current,
      paymentMethod: "Razorpay",
      orderId: createdOrder.order?._id,
    }));
    cart.forEach((item) => removeFromCart(item.productId));
    setStep(3);
  };

  return (
    <>
      {step === 1 && (
        <CheckoutAddress
          cart={cart}
          initialAddress={orderData?.address}
          onContinue={continueToPayment}
          isContinuing={isContinuing}
          continueError={checkoutError}
        />
      )}

      {step === 2 && (
        <Payment
          setStep={setStep}
          orderData={orderData}
          onPlaceOrder={placeOrder}
        />
      )}

      {step === 3 && <Confirmation orderData={orderData} />}
    </>
  );
};

export default Checkout;