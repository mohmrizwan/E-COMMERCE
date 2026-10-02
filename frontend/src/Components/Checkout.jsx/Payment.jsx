import React, { useState } from "react";
import { Link } from "react-router-dom";
import OrderSummary from "../OrderSummary";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const API_URL = "https://ecommerceba-6dtt.onrender.com";
const paymentMethods = [
  // {
  //   id: "upi",
  //   label: "UPI",
  //   detail: "Pay with any UPI app",
  //   icon: "fa-brands fa-google-pay",
  // },
  // {
  //   id: "card",
  //   label: "Credit / Debit Card",
  //   detail: "Visa, Mastercard and more",
  //   icon: "fa-regular fa-credit-card",
  // },
  // {
  //   id: "netbanking",
  //   label: "Net Banking",
  //   detail: "All major banks",
  //   icon: "fa-solid fa-building-columns",
  // },
  // {
  //   id: "cod",
  //   label: "Cash on Delivery",
  //   detail: "Pay when your order arrives",
  //   icon: "fa-solid fa-money-bill-wave",
  // },
];

const Payment = ({ setStep, orderData, onPlaceOrder, onInitiatePayment }) => {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [paymentState, setPaymentState] = useState("idle");
  const [paymentError, setPaymentError] = useState("");
  const isBusy = paymentState === "initiating" || paymentState === "processing";
  const canPay = Boolean(orderData?.items?.length && orderData?.address);
  // const [amount, setAmount] = useState(350);
  // const handlePayNow = async () => {
  //   if (!canPay || isBusy) return;

  //   setPaymentError("");
  //   if (typeof onInitiatePayment !== "function") {
  //     setPaymentState("unavailable");
  //     setPaymentError(
  //       "Payment and order placement are not connected yet. No payment was taken and no order was placed.",
  //     );
  //     return;
  //   }

  //   setPaymentState("initiating");
  //   try {
  //     const result = await onInitiatePayment({
  //       orderData,
  //       paymentMethod: selectedMethod,
  //     });
  //     const nextState = ["processing", "success", "failed", "cancelled"].includes(
  //       result?.status,
  //     )
  //       ? result.status
  //       : "failed";

  //     setPaymentState(nextState);
  //     if (nextState === "success") {
  //       onPlaceOrder(selectedMethod);
  //     } else if (nextState === "failed") {
  //       setPaymentError(result?.message || "Payment could not be completed.");
  //     } else if (nextState === "cancelled") {
  //       setPaymentError("Payment was cancelled. You can try again.");
  //     }
  //   } catch (error) {
  //     setPaymentState("failed");
  //     setPaymentError(error?.message || "Payment could not be started.");
  //   }
  // };

  const retryPayment = () => {
    setPaymentState("idle");
    setPaymentError("");
    handlePayNow();
  };

  const handlePayNow = async () => {
    if (!canPay || isBusy) return;

    setPaymentError("");
    setPaymentState("initiating");

    try {
      const response = await axios.post(
        `${API_URL}/payment/get-payment`,
        {
          amount: orderData.total,
        },
      );
      const data = response.data?.data;

      if (!data?.id || !data.amount || !data.currency) {
        throw new Error("The server did not return a valid Razorpay order.");
      }

      handlePaymentVerify(data);
    } catch (error) {
      console.log(error);
      setPaymentState("failed");
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Could not start payment.",
      );
    }
  };

  const handlePaymentVerify = async (data) => {
    if (typeof window.Razorpay !== "function") {
      throw new Error(
        "Razorpay Checkout did not load. Please refresh and try again.",
      );
    }

    const option = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Rizwan",
      description: "Test Mode",
      order_id: data.id,

      handler: async (response) => {
        console.log("RAZORPAY RESPONSE:", response);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        if (
          !razorpay_order_id ||
          razorpay_order_id !== data.id ||
          !razorpay_payment_id ||
          !razorpay_signature
        ) {
          setPaymentState("failed");
          setPaymentError(
            "Razorpay returned incomplete payment details. The payment was not verified.",
          );
          return;
        }

        try {
          const verifyResponse = await axios.post(
            `${API_URL}/payment/verify`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
          );

          console.log("VERIFY:", verifyResponse.data);

          if (verifyResponse.data.success) {
            const orderResponse = await axios.post(
              `${API_URL}/order/createOrder`,
              {
                items: orderData.items,
                shippingAddress: orderData.address,
                paymentMethod: "Razorpay",
                paymentStatus: "Paid",
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              },
            );

            console.log("Order Created:", orderResponse.data);

            setPaymentState("success");
          }
        } catch (error) {
          console.log("Payment Error:", error);
          setPaymentState("failed");
          setPaymentError(
            error.response?.data?.message || "Payment verification failed.",
          );
        }
      },

      theme: {
        color: "#5f63b8",
      },
    };

    const razorpay = new window.Razorpay(option);

    setPaymentState("processing");
    razorpay.open();
  };

  const statusMessage = {
    initiating: "Opening secure payment...",
    processing: "Payment is processing. Please wait for confirmation.",
    success: "Payment confirmed.",
    failed: paymentError,
    cancelled: paymentError,
    unavailable: paymentError,
  }[paymentState];

  return (
    <>
      <div className="address-wrapper bg-[white] py-4">
        <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-15">
          <div className="address-header flex justify-between  items-center ">
            <Link to="/" className="shrink-0">
              <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                Vendor<span className="text-[#6c3bff]">Aflame</span>
              </p>
            </Link>

            <div>
              <p className="text-sm font-[inter]">Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
      <div className="address-conetnt my-6 sm:my-8 lg:my-10">
        <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-10 xl:px-15">
          <div className="addrss-left min-w-0 w-full lg:w-[60%]">
            <div className="status hidden sm:flex my-6 w-full items-center justify-between gap-1 overflow-hidden sm:my-10 sm:gap-2">
              {/* Address */}
              <div className="address flex gap-3 items-center">
                <div className="bg-[#6C3BFF] px-3 py-2 rounded-[50%] border-2 font-[inter] text-[#FFFFFF] font-bold text-xs border-[#6C3BFF]">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>
                  <p className="font-[inter] font-bold text-sm text-[#6B7280]">
                    Address
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="h-px min-w-2 flex-1 bg-gray-300 sm:mx-2 md:mx-4"></div>

              {/* Payment */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] border-2 font-[inter] font-bold text-xs text-[#6C3BFF] border-[#6C3BFF]">
                  2
                </div>
                <div>
                  <p className="font-[inter] font-bold text-sm text-[#6B7280]">
                    Payment
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="h-px min-w-2 flex-1 bg-gray-300 sm:mx-2 md:mx-4"></div>

              {/* Confirmation */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] font-[inter] font-bold text-xs text-[#6B7280]">
                  3
                </div>
                <div>
                  <p className="font-[inter] font-bold text-sm text-[#6B7280]">
                    Confirmation
                  </p>
                </div>
              </div>
            </div>
            <div className="payment-form min-w-0 rounded-2xl bg-[#FFFFFF] p-4 sm:p-6 md:p-7">
              <div className="payment-head flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-[inter] text-xl font-bold text-[#00000] sm:text-2xl">
                    Payment
                  </h3>

                  <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
                    All transactions are secure and encrypted.
                  </p>
                </div>
              </div>
              <div className="payment-details space-y-5">
                <section className="rounded-xl border border-[#E5E7EB] p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-[inter] text-sm font-bold text-[#111827]">
                        Delivery address
                      </h4>
                      {orderData?.address ? (
                        <div className="mt-2 text-sm leading-6 text-[#6B7280]">
                          <p className="font-semibold text-[#111827]">
                            {orderData.address.name} · {orderData.address.type}
                          </p>
                          <p>{orderData.address.phone}</p>
                          <p className="wrap-break-word">
                            {orderData.address.address},{" "}
                            {orderData.address.city}, {orderData.address.state}{" "}
                            {orderData.address.pincode}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-red-600">
                          Select a delivery address before payment.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="shrink-0 text-sm font-bold text-[#6C3BFF] hover:text-[#421db3]"
                    >
                      Change
                    </button>
                  </div>
                </section>

                <section>
                  <h4 className="font-[inter] text-sm font-bold text-[#111827]">
                    Choose a payment method
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                    Payment options will be enabled when secure checkout is
                    connected.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Payment method"
                    className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        role="radio"
                        aria-checked={selectedMethod === method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`flex min-w-0 items-start gap-3 rounded-xl border p-4 text-left transition ${
                          selectedMethod === method.id
                            ? "border-[#6C3BFF] bg-[#F7F5FF] text-[#6C3BFF]"
                            : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#b6a5e7]"
                        }`}
                      >
                        <i
                          className={`${method.icon} mt-0.5 w-5 shrink-0 text-center`}
                        />
                        <span className="min-w-0">
                          <span className="block wrap-break-word text-sm font-semibold">
                            {method.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#6B7280]">
                            {method.detail}
                          </span>
                        </span>
                        <span
                          className={`ml-auto mt-1 h-4 w-4 shrink-0 rounded-full border ${
                            selectedMethod === method.id
                              ? "border-4 border-[#6C3BFF]"
                              : "border-[#9CA3AF]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </section>

                {statusMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl border p-4 text-sm ${
                      paymentState === "success"
                        ? "border-green-200 bg-green-50 text-green-800"
                        : paymentState === "processing" ||
                            paymentState === "initiating"
                          ? "border-[#d9ceff] bg-[#F7F5FF] text-[#4b2aa8]"
                          : "border-amber-200 bg-amber-50 text-amber-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isBusy && (
                        <i className="fa-solid fa-spinner mt-0.5 animate-spin" />
                      )}
                      <p>{statusMessage}</p>
                    </div>
                    {(paymentState === "failed" ||
                      paymentState === "cancelled") && (
                      <button
                        type="button"
                        onClick={retryPayment}
                        disabled={isBusy}
                        className="mt-3 font-bold underline underline-offset-2 disabled:opacity-50"
                      >
                        Retry payment
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-500 transition hover:text-gray-800"
                  >
                    <i className="fa-solid fa-arrow-left" />
                    &nbsp; Back to address
                  </button>
                  <button
                    type="button"
                    onClick={handlePayNow}
                    disabled={!canPay || isBusy}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#6C3BFF] px-5 py-3 text-center text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-48"
                  >
                    {isBusy ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin" />
                        Starting secure payment...
                      </>
                    ) : selectedMethod === "cod" ? (
                      `Place COD order · ₹${Number(orderData?.total || 0).toLocaleString("en-IN")}`
                    ) : (
                      `Pay ₹${Number(orderData?.total || 0).toLocaleString("en-IN")}`
                    )}
                  </button>
                  <Toaster />
                </div>
              </div>
            </div>
          </div>
          <OrderSummary orderData={orderData} />
        </div>
      </div>
    </>
  );
};

export default Payment;
