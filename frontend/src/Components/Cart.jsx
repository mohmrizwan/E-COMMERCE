import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Components/CartContext";

const Cart = () => {
  const {
    cart: contextCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  const cart = Array.isArray(contextCart) ? contextCart : [];

  // Subtotal
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  // Original price total
  const originalTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.originalPrice || item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // Discount
  const discount = originalTotal - subtotal;

  // Shipping
  // Abhi free shipping rakha hai
  const shipping = 0;

  // Final total
  const total = subtotal + shipping;

  return (
    <div className="cart-wrapper my-5">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
        {/* Cart Heading */}
        <div className="cart-head flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <h3 className="font-[inter] text-2xl font-bold text-black sm:text-3xl">
              Shopping Cart
            </h3>

            <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
              {cart.length}{" "}
              {cart.length === 1 ? "item" : "items"} from vendors
            </p>
          </div>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="my-10 flex flex-col items-center justify-center rounded-[20px] border border-[#dde3f0] bg-white px-5 py-16 text-center">
            <i className="fa-solid fa-cart-shopping text-5xl text-[#dde3f0]"></i>

            <h2 className="mt-5 font-[inter] text-xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-[#6B7280]">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="mt-6 rounded-xl bg-[#6C3BFF] px-6 py-3 font-[inter] text-sm font-semibold text-white transition duration-150 hover:bg-[#5427d6]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-details flex flex-col gap-5 lg:flex-row">
            {/* LEFT - CART */}
            <div className="cart-left w-full lg:w-[70%]">
              <div className="carts my-5 flex max-w-[800px] flex-col gap-4">
                {cart.map((item) => {
                  const itemPrice = Number(item.price || 0);
                  const itemOriginalPrice = Number(
                    item.originalPrice ?? item.price ?? 0
                  );
                  const quantity = Number(item.quantity || 1);

                  return (
                    <div
                      key={item.productId}
                      className="cart w-full overflow-hidden rounded-[20px] border border-[#dde3f0] bg-white transition duration-150 hover:border-[#b6a5e7]"
                    >
                      {/* Vendor Header */}
                      <div className="flex items-center justify-between gap-3 p-5">
                        <p className="font-[inter] text-sm font-bold">
                          {item.vendorName || "Vendor"}
                        </p>

                        <p className="rounded-2xl bg-[#E3F4E9] px-3 py-1 text-xs font-bold text-green-600">
                          Free Shipping
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-gray-200"></div>

                      {/* Product */}
                      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          {/* Product Image */}
                          <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5f5f5]">
                            {typeof item.image === "string" && item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <i className="fa-regular fa-image text-2xl text-[#9CA3AF]"></i>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="min-w-0">
                            <h1 className="cursor-pointer font-[inter] text-sm font-semibold transition duration-150 hover:text-[#6C3BFF] sm:text-base">
                              {item.name || "Unnamed product"}
                            </h1>

                            {item.color && (
                              <p className="mt-1 text-xs text-[#6B7280]">
                                {item.color}
                              </p>
                            )}

                            {/* Quantity */}
                            <div className="mt-3 flex w-fit items-center overflow-hidden rounded-lg border border-[#dde3f0]">
                              <button
                                onClick={() =>
                                  decreaseQuantity(item.productId)
                                }
                                disabled={quantity <= 1}
                                className="flex h-7 w-7 items-center justify-center text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <i className="fa-solid fa-minus"></i>
                              </button>

                              <span className="flex h-7 w-8 items-center justify-center border-x border-[#dde3f0] text-xs font-semibold">
                                {quantity}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(item.productId)
                                }
                                className="flex h-7 w-7 items-center justify-center text-sm transition hover:bg-gray-100"
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                          <button
                            onClick={() =>
                              removeFromCart(item.productId)
                            }
                            className="text-[#6B7280] transition hover:text-red-500"
                            title="Remove item"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="font-[inter] text-sm font-bold sm:text-base">
                              ₹{(itemPrice * quantity).toLocaleString("en-IN")}
                            </span>

                            {itemOriginalPrice > itemPrice && (
                              <span className="font-[inter] text-xs text-[#6B7280] line-through">
                                ₹
                                {(
                                  itemOriginalPrice * quantity
                                ).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT - BILL */}
            <div className="cart-right w-full lg:w-[30%]">
              <div className="cart-bill my-5 overflow-hidden rounded-[20px] border border-[#dde3f0] bg-white p-5 transition duration-150 hover:border-[#b6a5e7]">
                {/* Heading */}
                <h2 className="font-[inter] text-lg font-bold">
                  Order Summary
                </h2>

                <div className="my-5 h-[1px] w-full bg-gray-200"></div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-[inter] text-sm text-[#6B7280]">
                      Subtotal
                    </span>

                    <span className="font-[inter] text-sm font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-[inter] text-sm text-[#6B7280]">
                      Shipping
                    </span>

                    <span className="font-[inter] text-sm font-semibold text-green-600">
                      {shipping === 0
                        ? "Free"
                        : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-[inter] text-sm text-[#6B7280]">
                      Discount
                    </span>

                    <span className="font-[inter] text-sm font-semibold text-green-600">
                      -₹{discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="my-5 h-[1px] w-full bg-gray-200"></div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-[inter] text-base font-bold">
                    Total
                  </span>

                  <span className="font-[inter] text-xl font-bold text-[#6C3BFF]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Checkout */}
                <Link
                  to="/checkout"
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#6C3BFF] py-3 font-[inter] text-sm font-semibold text-white transition duration-150 hover:bg-[#5427d6]"
                >
                  Proceed to Checkout
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>

                {/* Secure Checkout */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
                  <i className="fa-solid fa-lock"></i>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
