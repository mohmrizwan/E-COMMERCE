import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../Components/CartContext";
import CheckoutAddress from "../Components/Checkout.jsx/Address";
import Payment from "../Components/Checkout.jsx/Payment";
import Confirmation from "../Components/Checkout.jsx/Confirmation";
import { resolveRazorpayKeyId } from "../../../shared/razorpayKeyId.mjs";
import { API_ORIGIN } from "../utils/productsApi";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const { cart: contextCart, removeFromCart } = useCart();
  const cart = Array.isArray(contextCart) ? contextCart : [];

  const requestCheckout = async (address, selectedCouriers = {}, createPayment = false) => {
    setIsContinuing(true);
    setCheckoutError("");

    try {
      console.info("[checkout:cart]", cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        cartPrice: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
      })));
      const response = await axios.post(
        `${API_ORIGIN}/payment/${createPayment ? "get-payment" : "quote"}`,
        {
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity || 1),
            // Diagnostic only; the backend always prices from MongoDB.
            price: Number(item.price),
          })),
          shippingAddress: address,
          selectedCouriers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      const checkout = response.data.checkout;
      let razorpayOrder = null;
      if (createPayment) {
        razorpayOrder = {
          ...response.data.data,
          keyId: resolveRazorpayKeyId({
            backendKeyId: response.data.data?.keyId,
            frontendKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
          }),
        };
        if (Number(razorpayOrder.amount) !== Math.round(checkout.finalTotal * 100)) {
          throw new Error("Checkout total does not match the Razorpay order amount. Please retry.");
        }
      }
      const items = checkout.items.map((item) => {
        const cartItem = cart.find(
          (current) => String(current.productId) === String(item.productId),
        );
        return {
          ...item,
          originalPrice: item.originalPrice ?? cartItem?.originalPrice ?? item.price,
          image: item.image || cartItem?.image || "",
        };
      });

      const preparedOrder = {
        items,
        storeName: checkout.storeName,
        address,
        subtotal: checkout.subtotalAmount,
        discount: 0,
        shipping: checkout.shippingAmount,
        total: checkout.finalTotal,
        shippingCourierCompanyId: checkout.shippingCourierCompanyId,
        shippingCourierName: checkout.shippingCourierName,
        estimatedDelivery: checkout.estimatedDelivery,
        vendorShippingQuotes: checkout.vendorShippingQuotes || [],
        razorpayOrder,
      };
      setOrderData(preparedOrder);
      return preparedOrder;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Could not calculate delivery charge. Please check the address and try again.";
      setCheckoutError(message);
      if (createPayment) throw new Error(message);
    } finally {
      setIsContinuing(false);
    }
  };

  const continueToPayment = async (address) => {
    const quote = await requestCheckout(address);
    if (quote) setStep(2);
  };

  const preparePayment = (selectedCouriers) =>
    requestCheckout(orderData?.address, selectedCouriers, true);

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
          onPreparePayment={preparePayment}
          onCourierSelectionChange={(quotes, shipping, total) => {
            setOrderData((current) => ({
              ...current,
              vendorShippingQuotes: quotes,
              shipping,
              total,
              razorpayOrder: null,
            }));
          }}
        />
      )}

      {step === 3 && <Confirmation orderData={orderData} />}
    </>
  );
};

export default Checkout;
