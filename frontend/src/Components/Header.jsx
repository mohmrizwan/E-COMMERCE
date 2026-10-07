import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const cartItemCount = cart.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0,
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div
        className={`header-top border-b bg-[#FFFFFF] border-gray-200  sticky top-0 z-50 backdrop-blur-xl transition-all duration-300  `}
      >
        <div className="mx-auto flex items-center justify-between gap-4 px-10 py-2 sm:px-6 lg:px-5">
          <p className="font-[inter] text-[11px] text-gray-500 sm:text-xs">
            Free shipping on orders over $50 · 30-day returns
          </p>

          <div className="hidden items-center gap-5 text-xs sm:flex">
            <Link
              to="/login"
              className="text-gray-500 transition-colors duration-500 hover:text-[#6c3bff]"
            >
              Sell on Marqo
            </Link>

            <Link
              to="/track-order"
              className="text-gray-500 transition-colors duration-500 hover:text-[#6c3bff]"
            >
              Track Order
            </Link>

            <Link
              to="/help"
              className="text-gray-500 transition-colors duration-500 hover:text-[#6c3bff]"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`header-wrapper  sticky top-0 z-50 border-b  border-gray-200 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-gray-200/60 bg-white/70 backdrop-blur-xl"
            : "bg-[#ffffff]"
        }`}
      >
        <div className="mx-auto flex flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:gap-8 lg:px-10 lg:py-4">
          <Link to="/" className="shrink-0">
            <p className="whitespace-nowrap font-[inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
              Vendor<span className="text-[#6c3bff]">Aflame</span>
            </p>
          </Link>

          <div className="order-3 flex w-full items-center rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10 lg:order-none lg:mx-auto lg:max-w-4xl">
            <i className="fa-solid fa-magnifying-glass mr-3 text-sm text-gray-500"></i>

            <input
              type="text"
              placeholder="Search products, brands & more..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2">
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff] sm:flex lg:px-4 lg:py-2.5"
            >
              <i className="fa-solid fa-shop text-sm"></i>
              <span>Sell</span>
            </Link>

            <Link
              to="/account"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-[#6c3bff] sm:h-10 sm:w-10"
            >
              <i className="fa-regular fa-user"></i>
            </Link>

            <Link
              to="/orders"
              aria-label="My orders"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-[#6c3bff] sm:h-10 sm:w-10"
            >
              <i className="fa-solid fa-box" />
            </Link>

            <Link
              to="/favorite"
              className="h-10 flex w-10 items-center justify-center rounded-xl text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-[#6c3bff] sm:flex"
            >
              <i className="fa-regular fa-heart"></i>
            </Link>

            <Link
              to="/cart"
              aria-label={`Shopping cart, ${cartItemCount} items`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-[#6c3bff] sm:h-10 sm:w-10"
            >
              <i className="fa-solid fa-bag-shopping"></i>

              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6c3bff] px-1 text-[10px] font-semibold text-white">
                {cartItemCount}
              </span>
            </Link>
          </div>
        </div>

      
      </header>
    </>
  );
};

export default Header;
