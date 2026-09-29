import React, { useState } from "react";
import { useCart } from "../Components/CartContext";
import CheckoutAddress from "../Components/Checkout.jsx/Address";
import Payment from "../Components/Checkout.jsx/Payment";
import Confirmation from "../Components/Checkout.jsx/Confirmation";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const { cart: contextCart } = useCart();
  const cart = Array.isArray(contextCart) ? contextCart : [];

  const continueToPayment = (address) => {
    const items = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    }));
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discount = items.reduce(
      (sum, item) =>
        sum + Math.max(item.originalPrice - item.price, 0) * item.quantity,
      0,
    );
    const shipping = 0;

    setOrderData({
      items,
      address,
      subtotal,
      discount,
      shipping,
      total: subtotal + shipping,
    });
    setStep(2);
  };

  const placeOrder = (paymentMethod) => {
    setOrderData((current) => ({ ...current, paymentMethod }));
    setStep(3);
  };

  return (
    <>
      {step === 1 && (
        <CheckoutAddress
          cart={cart}
          initialAddress={orderData?.address}
          onContinue={continueToPayment}
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