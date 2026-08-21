import React from "react";
import { Link } from "react-router-dom";
import OrderSummary from "../OrderSummary";

const Confirmation = () => {
  return (
    <>
      {/* Header */}
      <div className="address-wrapper bg-white py-4">
        <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-15">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="shrink-0">
              <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                Vendor<span className="text-[#6c3bff]">Aflame</span>
              </p>
            </Link>

            <p className="whitespace-nowrap text-xs font-[Inter] sm:text-sm">
              Secure Checkout
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="address-content my-6 sm:my-8 lg:my-10">
        <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-8 lg:flex-row lg:items-start lg:gap-8 lg:px-10 xl:px-15">

          {/* Left Section */}
          <div className="address-left min-w-0 w-full lg:w-[60%]">

            {/* Checkout Status */}
            <div className="status my-6 hidden w-full items-center sm:flex sm:my-8 lg:my-10">
              
              {/* Address */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#6C3BFF] bg-[#6C3BFF] text-xs font-bold text-white sm:h-9 sm:w-9">
                  <i className="fa-solid fa-check"></i>
                </div>

                <p className="whitespace-nowrap text-xs font-bold text-[#6B7280] sm:text-sm">
                  Address
                </p>
              </div>

              {/* Line */}
              <div className="mx-2 h-px min-w-3 flex-1 bg-gray-300 sm:mx-3 md:mx-4"></div>

              {/* Payment */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#6C3BFF] bg-[#6C3BFF] text-xs font-bold text-white sm:h-9 sm:w-9">
                  <i className="fa-solid fa-check"></i>
                </div>

                <p className="whitespace-nowrap text-xs font-bold text-[#6B7280] sm:text-sm">
                  Payment
                </p>
              </div>

              {/* Line */}
              <div className="mx-2 h-px min-w-3 flex-1 bg-gray-300 sm:mx-3 md:mx-4"></div>

              {/* Confirmation */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#6C3BFF] bg-[#6C3BFF] text-xs font-bold text-white sm:h-9 sm:w-9">
                  <i className="fa-solid fa-check"></i>
                </div>

                <p className="whitespace-nowrap text-xs font-bold text-[#6B7280] sm:text-sm">
                  Confirmation
                </p>
              </div>
            </div>

            {/* Confirmation Card */}
            <div className="payment-form flex min-w-0 flex-col items-center justify-center gap-5 rounded-2xl bg-white border border-[#E5E7EB] p-4 sm:p-6 md:p-8 lg:p-10">

              {/* Success Icon */}
              <div className="flex w-fit items-center justify-center rounded-2xl bg-[#E7F5EC] p-4 sm:p-5">
                <i className="fa-regular fa-circle-check text-3xl font-semibold text-green-600 sm:text-4xl"></i>
              </div>

              {/* Heading */}
              <div className="text-center">
                <p className="font-[Inter] text-xl font-bold sm:text-2xl">
                  Order Confirmed
                </p>
              </div>

              {/* Description */}
              <div className="max-w-md text-center">
                <p className="text-xs leading-5 text-[#6B7280] sm:text-sm">
                  Thank you, Priya. Order{" "}
                  <span className="font-bold text-black">
                    #NX-48213
                  </span>{" "}
                  is on its way.
                </p>
              </div>

              {/* Order Status */}
              <div className="order-status w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] p-4 sm:p-5">
                
                {/* Delivery */}
                <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p className="text-xs text-[#6B7280] sm:text-sm">
                    Estimated Delivery
                  </p>

                  <p className="text-xs font-bold sm:text-sm">
                    Aug-15 - Aug-20
                  </p>
                </div>

                {/* Shipping */}
                <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p className="text-xs text-[#6B7280] sm:text-sm">
                    Shipping to
                  </p>

                  <p className="text-xs font-bold sm:text-sm">
                    San Francisco, CA
                  </p>
                </div>

                {/* Total */}
                <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p className="text-xs text-[#6B7280] sm:text-sm">
                    Total Paid
                  </p>

                  <p className="text-xs font-bold sm:text-sm">
                    $574
                  </p>
                </div>
              </div>

              {/* Track Button */}
              <button
                type="button"
                className="w-full rounded-2xl bg-[#6C3BFF] px-5 py-3 text-center text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:w-auto sm:min-w-[160px] sm:px-6"
              >
                Track Order
              </button>
            </div>
          </div>

          {/* Right Section */}
    
            <OrderSummary />
        

        </div>
      </div>
    </>
  );
};

export default Confirmation;