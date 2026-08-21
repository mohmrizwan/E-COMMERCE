import React from "react";
import img from "../assets/images/close-up-futuristic-sneakers-showcase.jpg";
const OrderSummary = () => {
  return (
    <div className="address-right mt-0 w-full lg:mt-28 lg:w-[35%]">
      {/* ORDER SUMMARY */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6">
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
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5] sm:h-20 sm:w-20">
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

            <p className="mt-1 font-[inter] text-xs text-[#6B7280]">Qty: 1</p>
          </div>

          <p className="shrink-0 font-[inter] text-sm font-semibold text-[#111827]">
            ₹4,999
          </p>
        </div>

        {/* Product 2 */}
        <div className="mt-5 flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5] sm:h-20 sm:w-20">
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

            <p className="mt-1 font-[inter] text-xs text-[#6B7280]">Qty: 2</p>
          </div>

          <p className="shrink-0 font-[inter] text-sm font-semibold text-[#111827]">
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
            <span className="font-[inter] text-sm text-[#6B7280]">Tax</span>

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
  );
};

export default OrderSummary;
