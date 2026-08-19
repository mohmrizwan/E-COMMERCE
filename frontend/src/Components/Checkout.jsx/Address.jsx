import React from "react";
import { Link } from "react-router-dom";
import img from "../../assets/images/close-up-futuristic-sneakers-showcase.jpg";
const Address = () => {
  return (
    <>
      <div className="address-wrapper  py-4 bg-[white]">
        <div className="mx-auto px-15">
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

      <div className="address-conetnt my-10">
        <div className="mx-auto px-15 flex justify-between">
          <div className="addrss-left w-[60%]">
            <div className="status flex justify-between items-center my-10">
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
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>

              {/* Delivery */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] text-[inter] font-bold text-xs text-[#6B7280]">
                  2
                </div>
                <div>
                  <p className="text-[inter] font-bold text-sm text-[#6B7280]">
                    Delivery
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>

              {/* Payment */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] text-[inter] font-bold text-xs text-[#6B7280]">
                  3
                </div>
                <div>
                  <p className="text-[inter] font-bold text-sm text-[#6B7280]">
                    Payment
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>

              {/* Confirmation */}
              <div className="Delivery flex gap-3 items-center">
                <div className="bg-[#E9E5FC] px-3 py-2 rounded-[50%] text-[inter] font-bold text-xs text-[#6B7280]">
                  4
                </div>
                <div>
                  <p className="text-[inter] font-bold text-sm text-[#6B7280]">
                    Confirmation
                  </p>
                </div>
              </div>
            </div>
            <div className="address-form bg-[#FFFFFF] rounded-2xl p-7">
              <div className="product-head flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-[inter] text-2xl font-bold text-[#00000">
                    Shipping address
                  </h3>

                  <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
                    Where should we send your order?
                  </p>
                </div>
              </div>
              <div>
                <form action="" className="my-3">
                  <div className="flex gap-5">
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
                  <div className="flex gap-5">
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
                  <div className="flex gap-5">
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
                  <div className="flex gap-5">
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
                  <div className="flex gap-5">
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
                  <div className="flex gap-5">
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

                  <div className="flex justify-between items-center mt-5">
                    <Link className="text-gray-300 hover:text-gray-700 transition text-sm duration-150">
                      {" "}
                      <i className="fa-solid fa-arrow-left"></i>&nbsp;Back To
                      Cart
                    </Link>
                    <Link
                      to="/"
                      className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                    >
                      Continue
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="address-right w-[35%] mt-28">
            {/* ORDER SUMMARY */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              {/* Heading */}
              <div className="mb-6">
                <h2 className="font-[inter] text-lg font-bold text-[#111827]">
                  Order Summary
                </h2>

                <p className="mt-1 font-[inter] text-xs text-[#6B7280]">
                  2 items in your cart
                </p>
              </div>

              {/* Product 1 */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5]">
                  <img
                    src={img}
                    alt="Nike Air Max"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-[inter] text-sm font-semibold text-[#111827]">
                    Nike Air Max
                  </h3>

                  <p className="mt-1 font-[inter] text-xs text-[#6B7280]">
                    Qty: 1
                  </p>
                </div>

                <p className="font-[inter] text-sm font-semibold text-[#111827]">
                  ₹4,999
                </p>
              </div>

              {/* Product 2 */}
              <div className="mt-5 flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5]">
                  <img
                    src={img}
                    alt="Adidas Runner"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-[inter] text-sm font-semibold text-[#111827]">
                    Adidas Runner
                  </h3>

                  <p className="mt-1 font-[inter] text-xs text-[#6B7280]">
                    Qty: 2
                  </p>
                </div>

                <p className="font-[inter] text-sm font-semibold text-[#111827]">
                  ₹3,998
                </p>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-[#E5E7EB]"></div>

              {/* Price */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="font-[inter] text-sm text-[#6B7280]">
                    Subtotal
                  </span>

                  <span className="font-[inter] text-sm font-medium text-[#111827]">
                    ₹8,997
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-[inter] text-sm text-[#6B7280]">
                    Shipping
                  </span>

                  <span className="font-[inter] text-sm font-medium text-[#111827]">
                    ₹100
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-[inter] text-sm text-[#6B7280]">
                    Tax
                  </span>

                  <span className="font-[inter] text-sm font-medium text-[#111827]">
                    ₹450
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="my-5 h-px bg-[#E5E7EB]"></div>

              <div className="flex items-center justify-between">
                <span className="font-[inter] text-base font-bold text-[#111827]">
                  Total
                </span>

                <span className="font-[inter] text-xl font-bold text-[#6C3BFF]">
                  ₹9,547
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Address;
