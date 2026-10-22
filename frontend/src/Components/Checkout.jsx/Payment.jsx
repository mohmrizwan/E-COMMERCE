import React, { useState } from "react";
import { Link } from "react-router-dom";
import OrderSummary from "../OrderSummary";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { resolveRazorpayKeyId } from "../../../../shared/razorpayKeyId.mjs";
import { API_ORIGIN } from "../../utils/productsApi";
import { STORE_NAME } from "../../config/brand.js";
import { useStorefront } from "../../hooks/useStorefront.js";

const Payment = ({ setStep, orderData, onPlaceOrder, onPreparePayment, onCourierSelectionChange }) => {
  const storefront = useStorefront();
  const [paymentState, setPaymentState] = useState("idle");
  const [paymentError, setPaymentError] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [selectedCouriers, setSelectedCouriers] = useState(() =>
    Object.fromEntries((orderData?.vendorShippingQuotes || []).map((quote) => [String(quote.vendorId), quote.courierCompanyId])),
  );
  const isBusy = paymentState === "initiating" || paymentState === "processing";
  const canPay = Boolean(
    orderData?.items?.length &&
      orderData?.address,
  );
  const selectCourier = (vendorQuote, courier) => {
    const nextSelections = { ...selectedCouriers, [String(vendorQuote.vendorId)]: courier.courierCompanyId };
    setSelectedCouriers(nextSelections);
    const updatedQuotes = orderData.vendorShippingQuotes.map((quote) => {
      if (String(quote.vendorId) !== String(vendorQuote.vendorId)) return quote;
      return {
        ...quote,
        courierCompanyId: courier.courierCompanyId,
        courierName: courier.courierName,
        estimatedDelivery: courier.estimatedDelivery,
        shippingAmount: courier.shippingAmount,
        additionalCharges: courier.additionalCharges,
      };
    });
    const shipping = updatedQuotes.reduce((total, quote) => total + Number(quote.shippingAmount || 0), 0);
    onCourierSelectionChange?.(updatedQuotes, shipping, Number(orderData.subtotal || 0) + shipping);
  };
  const createStoreOrder = async (razorpayOrderId) => {
    const orderResponse = await axios.post(
      `${API_ORIGIN}/order/createOrder`,
      { razorpay_order_id: razorpayOrderId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );

    if (!orderResponse.data?.order) {
      throw new Error("Payment was verified, but the order was not created.");
    }

    setPaymentState("success");
    onPlaceOrder(orderResponse.data);
  };

  const handlePayNow = async () => {
    if (!canPay || isBusy) return;

    setPaymentError("");
    setPaymentState("initiating");

    if (paymentVerified) {
      try {
        await createStoreOrder(orderData.razorpayOrder.id);
      } catch (error) {
        setPaymentState("failed");
        setPaymentError(
          error.response?.data?.message ||
            error.message ||
            "Payment was verified, but order creation failed. Retry to finish placing the order.",
        );
      }
      return;
    }

    let paymentOrderData = orderData;
    if (!paymentOrderData?.razorpayOrder?.id) {
      try {
        paymentOrderData = await onPreparePayment(selectedCouriers);
        if (!paymentOrderData?.razorpayOrder?.id) {
          throw new Error("Could not prepare payment for the selected courier. Please try again.");
        }
      } catch (error) {
        setPaymentState("failed");
        setPaymentError(error.message || "Could not prepare payment for the selected courier.");
        return;
      }
    }

    const data = paymentOrderData.razorpayOrder;
    if (!data?.id || !data.amount || !data.currency) {
      setPaymentState("failed");
      setPaymentError("The server did not return a valid Razorpay order.");
      return;
    }

    if (typeof window.Razorpay !== "function") {
      setPaymentState("failed");
      setPaymentError("Razorpay Checkout did not load. Please refresh and try again.");
      return;
    }

    const option = {
      key: resolveRazorpayKeyId({
        backendKeyId: data.keyId,
        frontendKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
      }),
      amount: data.amount,
      currency: data.currency,
      name: orderData.storeName || "Store",
      description: "Secure checkout",
      order_id: data.id,

      handler: async (response) => {
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
            `${API_ORIGIN}/payment/verify`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            },
          );

          if (!verifyResponse.data.success) {
            throw new Error("Payment verification failed.");
          }

          setPaymentVerified(true);
          await createStoreOrder(razorpay_order_id);
        } catch (error) {
          setPaymentState("failed");
          setPaymentError(
            error.response?.data?.message ||
              error.message ||
              "Payment verification or order creation failed.",
          );
        }
      },

      modal: {
        ondismiss: () => {
          setPaymentState("cancelled");
          setPaymentError("Payment was cancelled. You can try again.");
        },
      },

      theme: {
        color: "#5f63b8",
      },
    };

    console.info("[checkout:razorpay-launch]", {
      orderId: data.id,
      orderAmountPaise: data.amount,
      orderAmountRupees: Number(data.amount) / 100,
      summaryFinalTotal: orderData.total,
    });

    const razorpay = new window.Razorpay(option);
    razorpay.on("payment.failed", (response) => {
      setPaymentState("failed");
      setPaymentError(
        response.error?.description || "Payment could not be completed.",
      );
    });

    setPaymentState("processing");
    razorpay.open();
  };

  const retryPayment = () => {
    setPaymentState("idle");
    setPaymentError("");
    handlePayNow();
  };

  const statusMessage = {
    initiating: "Opening secure payment...",
    processing: "Payment is processing. Please wait for confirmation.",
    success: "Payment confirmed and order placed.",
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
              {storefront?.websiteLogo ? <img src={storefront.websiteLogo} alt={storefront.businessName || STORE_NAME} className="h-10 max-w-48 object-contain object-left" /> : <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">{storefront?.businessName || STORE_NAME}</p>}
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

                <section className="rounded-xl border border-[#E5E7EB] p-4 sm:p-5">
                  <h4 className="font-[inter] text-sm font-bold text-[#111827]">
                    Available courier partners
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                    Choose a courier for each store. Its estimated prepaid delivery rate is included in your total; COD charges do not apply to this prepaid order.
                  </p>
                  <div className="mt-3 space-y-4">
                    {(orderData?.vendorShippingQuotes || []).map((vendorQuote) => (
                      <div key={vendorQuote.vendorId}>
                        {(orderData.vendorShippingQuotes.length > 1) && (
                          <p className="mb-2 text-xs font-semibold text-[#4B5563]">Store delivery options</p>
                        )}
                        <div className="space-y-2">
                          {(vendorQuote.courierOptions || []).map((courier) => (
                            <div key={courier.courierCompanyId} className="flex items-center justify-between gap-3 rounded-lg bg-[#F9FAFB] px-3 py-2 text-sm">
                              <label className="flex min-w-0 cursor-pointer items-start gap-3">
                                <input
                                  type="radio"
                                  name={`courier-${vendorQuote.vendorId}`}
                                  checked={String(selectedCouriers[String(vendorQuote.vendorId)] || "") === String(courier.courierCompanyId)}
                                  onChange={() => selectCourier(vendorQuote, courier)}
                                  disabled={isBusy || paymentVerified}
                                  className="mt-1 accent-[#6C3BFF]"
                                />
                                <span className="min-w-0">
                                <p className="font-semibold text-[#111827]">
                                  {courier.courierName}
                                </p>
                                <p className="text-xs text-[#6B7280]">
                                  {courier.estimatedDelivery || "Delivery estimate unavailable"}{courier.isSurface ? " · Surface" : ""}
                                  {Number(courier.additionalCharges) > 0 ? ` · Includes ₹${Number(courier.additionalCharges).toLocaleString("en-IN", { maximumFractionDigits: 2 })} additional provider charges` : ""}
                                </p>
                                </span>
                              </label>
                              <span className="shrink-0 font-semibold">₹{Number(courier.shippingAmount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-[#E5E7EB] p-4">
                  <h4 className="font-[inter] text-sm font-bold text-[#111827]">
                    Pay securely with Razorpay
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                    Your product subtotal and delivery charge are included in the amount below.
                  </p>
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
