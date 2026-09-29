import React from "react";
import { useCart } from "./CartContext";

const OrderSummary = ({ orderData }) => {
  const { cart: contextCart } = useCart();
  const cart = Array.isArray(orderData?.items)
    ? orderData.items
    : Array.isArray(contextCart)
      ? contextCart
      : [];
  const subtotal =
    orderData?.subtotal ??
    cart.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );
  const discount =
    orderData?.discount ??
    cart.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const originalPrice = Number(item.originalPrice ?? price);
      return sum + Math.max(originalPrice - price, 0) * Number(item.quantity || 1);
    }, 0);
  const shipping = orderData?.shipping ?? 0;
  const total = orderData?.total ?? subtotal + shipping;

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
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="max-h-96 space-y-5 overflow-y-auto">
          {cart.map((item, index) => {
            const quantity = Number(item.quantity || 1);
            const unitPrice = Number(item.price || 0);

            return (
              <div
                key={item.productId || item._id || index}
                className="flex min-w-0 items-center gap-3 sm:gap-4"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F5F5F5] sm:h-20 sm:w-20">
                  {typeof item.image === "string" && item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <i className="fa-regular fa-image text-xl text-[#9CA3AF]"></i>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-[inter] text-sm font-semibold text-[#111827]">
                    {item.name || "Unnamed product"}
                  </h3>
                  <p className="mt-1 font-[inter] text-xs text-[#6B7280]">
                    Qty: {quantity} · ₹{unitPrice.toLocaleString("en-IN")} each
                  </p>
                </div>

                <p className="shrink-0 font-[inter] text-sm font-semibold text-[#111827]">
                  ₹{(unitPrice * quantity).toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
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
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-[inter] text-sm text-[#6B7280]">
              Shipping
            </span>

            <span className="font-[inter] text-sm font-medium text-[#111827]">
              {shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-[inter] text-sm text-[#6B7280]">Discount</span>

            <span className="font-[inter] text-sm font-medium text-green-600">
              -₹{discount.toLocaleString("en-IN")}
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
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
