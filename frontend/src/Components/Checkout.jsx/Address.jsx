import React from "react";
import { Link } from "react-router-dom";
import img from "../../assets/images/close-up-futuristic-sneakers-showcase.jpg";
import OrderSummary from "../OrderSummary";
const Address = ({ setStep }) => {
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
          <div className="addrss-left w-full lg:w-[60%]">
            <div className="status hidden sm:flex my-6 w-full items-center justify-between gap-1 overflow-hidden sm:my-10 sm:gap-2">
              {/* Address */}
              <div className="address flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] border-2 text-[inter] text-[#6C3BFF] font-bold text-xs border-[#6C3BFF]">
                  1
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
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] text-[inter] font-bold text-xs text-[#6B7280]">
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
            <div className="address-form rounded-2xl bg-[#FFFFFF] p-4 sm:p-6 md:p-7">
              <div className="product-head flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-[inter] text-xl font-bold text-[#00000] sm:text-2xl">
                    Shipping address
                  </h3>

                  <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
                    Where should we send your order?
                  </p>
                </div>
              </div>
              <div>
                <form action="" className="my-3">
                  <div className="flex flex-col gap-0 sm:flex-row sm:gap-5">
                    {/* First Name */}
                    <div className="form-control flex flex-1 flex-col">
                      <label
                        htmlFor="firstName"
                        className="text-xs font-[inter]"
                      >
                        First Name
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="firstName"
                          type="text"
                          placeholder="Priya"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-control flex flex-1 flex-col">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Last Name
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="lastname"
                          type="text"
                          placeholder="khan"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 sm:flex-row sm:gap-5">
                    {/* Email */}
                    <div className="form-control flex flex-1 flex-col">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Email
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 sm:flex-row sm:gap-5">
                    {/* Email */}
                    <div className="form-control flex flex-1 flex-col">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Phone Number
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="phone"
                          type="number"
                          placeholder="+91 1234567890"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 sm:flex-row sm:gap-5">
                    {/* Email */}
                    <div className="form-control flex flex-1 flex-col">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Address
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="phone"
                          type="text"
                          placeholder="4, Silcon City"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 sm:flex-row sm:gap-5">
                    <div className="form-control flex flex-1 flex-col">
                      <label
                        htmlFor="firstName"
                        className="text-xs font-[inter]"
                      >
                        City
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="city"
                          type="text"
                          placeholder="EdinBurgh"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="form-control flex flex-1 flex-col">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        State
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="state"
                          type="text"
                          placeholder="Scotland"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 sm:flex-row sm:gap-5">
                    <div className="form-control flex flex-1 flex-col">
                      <label
                        htmlFor="firstName"
                        className="text-xs font-[inter]"
                      >
                        ZIP Code
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="code"
                          type="text"
                          placeholder="450020"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="form-control flex flex-1 flex-col">
                      <label htmlFor="email" className="text-xs font-[inter]">
                        Country
                      </label>

                      <div className="flex min-w-0 my-3 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
                        <input
                          id="country"
                          type="text"
                          placeholder="Scotland"
                          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                    <Link  to={"/cart"}  className="text-gray-300 hover:text-gray-700 transition text-sm duration-150">
                      {" "}
                      <i className="fa-solid fa-arrow-left"></i>&nbsp;Back To
                      Cart
                    </Link>
                    <button
                      to="/"
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full rounded-2xl bg-[#6C3BFF] px-5 py-3 text-center text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:w-auto sm:px-6"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Address;
