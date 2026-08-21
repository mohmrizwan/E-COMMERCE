import { React, useState } from "react";
import { Link } from "react-router-dom";
import OrderSummary from "../OrderSummary";
const Payment = ({ setStep }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
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
                <div className="bg-[#6C3BFF] px-3 py-2 rounded-[50%] border-2 text-[inter] text-[#FFFFFF]  font-bold text-xs border-[#6C3BFF]">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>
                  <p className="text-[inter] font-bold text-sm text-[#6B7280]">
                    Address
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="h-px min-w-2 flex-1 bg-gray-300 sm:mx-2 md:mx-4"></div>

              {/* Payment */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] border-2 text-[inter] font-bold text-xs text-[#6C3BFF] border-[#6C3BFF]">
                  2
                </div>
                <div>
                  <p className="text-[inter] font-bold text-sm text-[#6B7280]">
                    Payment
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="h-px min-w-2 flex-1 bg-gray-300 sm:mx-2 md:mx-4"></div>

              {/* Confirmation */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] text-[inter] font-bold text-xs text-[#6B7280]">
                  3
                </div>
                <div>
                  <p className="text-[inter] font-bold text-sm text-[#6B7280]">
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
              <div className="payment-details">
                <div className="methods grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                  {/* Card */}
                  <div
                    onClick={() => setSelectedMethod("card")}
                    className={`h-fit min-w-0 w-full cursor-pointer rounded-2xl border px-3 py-3 transition duration-200 sm:w-50 sm:px-5 ${
                      selectedMethod === "card"
                        ? "border-[#6C3BFF] bg-[#E9E5FC] text-[#6C3BFF]"
                        : "border-[#E9E5FC] bg-[#F7F5FF] text-[#111827] hover:border-[#6C3BFF]"
                    }`}
                  >
                    <div>
                      <i className="fa-regular fa-credit-card"></i>
                    </div>

                    <p className="mt-2 break-words text-xs font-[inter] sm:text-sm">
                      Credit / Debit Card
                    </p>
                  </div>

                  {/* UPI */}
                  <div
                    onClick={() => setSelectedMethod("upi")}
                    className={`h-fit min-w-0 w-full cursor-pointer rounded-2xl border px-3 py-3 transition duration-200 sm:w-50 sm:px-5 ${
                      selectedMethod === "upi"
                        ? "border-[#6C3BFF] bg-[#E9E5FC] text-[#6C3BFF]"
                        : "border-[#E9E5FC] bg-[#F7F5FF] text-[#111827] hover:border-[#6C3BFF]"
                    }`}
                  >
                    <div>
                      <i className="fa-brands fa-google-pay"></i>
                    </div>

                    <p className="mt-2 text-xs font-[inter] sm:text-sm">UPI</p>
                  </div>
                </div>

                {selectedMethod === "card" ? (
                  <form className="card-details my-6 flex flex-col gap-3">
                    <div className="form-control flex flex-1 flex-col my-4">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Card Number
                      </label>

                      <div className="flex min-w-0  items-center my-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="phone"
                          type="text"
                          placeholder="422422422422"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="form-control flex flex-1 flex-col my-4">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Name On Card
                      </label>

                      <div className="flex min-w-0 my-1 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="phone"
                          type="text"
                          placeholder="Priya Sharma"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 sm:flex-row sm:gap-5 my-4">
                      {/* First Name */}
                      <div className="form-control flex flex-1 flex-col">
                        <label
                          htmlFor="firstName"
                          className="text-xs font-[inter]"
                        >
                          Expiry
                        </label>

                        <div className="flex min-w-0 my-1 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                          <input
                            id="firstName"
                            type="text"
                            placeholder="12/25"
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="form-control flex flex-1 flex-col">
                        <label htmlFor="email" className="text-xs font-[inter]">
                          CVV
                        </label>

                        <div className="flex min-w-0 my-1 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                          <input
                            id="lastname"
                            type="text"
                            placeholder="244"
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                      <button
                        className="text-gray-300 hover:text-gray-700 transition text-sm duration-150"
                        type="button"
                        onClick={() => setStep(1)}
                      >
                        <i className="fa-solid fa-arrow-left"></i>&nbsp;Back To
                        Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="w-full rounded-2xl bg-[#6C3BFF] px-5 py-3 text-center text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:w-auto sm:px-6"
                      >
                        Place Order
                      </button>
                    </div>
                  </form>
                ) : (
                  <form className="upi-details my-6 flex flex-col gap-3">
                    <div className="form-control flex flex-1 flex-col my-4">
                      <label htmlFor="upiId" className="text-xs font-[inter]">
                        UPI ID
                      </label>

                      <div className="flex min-w-0 my-1 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="upiId"
                          type="text"
                          placeholder="yourname@upi"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-gray-300 hover:text-gray-700 transition text-sm duration-150"
                      >
                        <i className="fa-solid fa-arrow-left"></i>&nbsp;Back To
                        Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="w-full rounded-2xl bg-[#6C3BFF] px-5 py-3 text-center text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:w-auto sm:px-6"
                      >
                        Place Order
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Payment;
