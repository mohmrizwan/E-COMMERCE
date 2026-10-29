import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { STORE_NAME } from "../config/brand.js";
import { useStorefront } from "../hooks/useStorefront.js";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(
    () => new URLSearchParams(location.search).get("search") || "",
  );
  const { cart } = useCart();
  const storefront = useStorefront();
  const cartItemCount = cart.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0,
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchTerm(new URLSearchParams(location.search).get("search") || "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    const currentQuery = new URLSearchParams(location.search).get("search") || "";
    const nextQuery = searchTerm.trim();

    if (currentQuery === nextQuery) return undefined;

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(
        location.pathname === "/products" ? location.search : "",
      );
      if (nextQuery) params.set("search", nextQuery);
      else params.delete("search");

      const queryString = params.toString();
      navigate(`/products${queryString ? `?${queryString}` : ""}`);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search, navigate, searchTerm]);

  return (
    <>
      <div
        className={`header-top border-b bg-[#173D35] border-[#D6B56D]/30 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300  `}
      >
        <div className="mx-auto flex items-center justify-between gap-4 px-10 py-2 sm:px-6 lg:px-5">
            <p className="font-[inter] text-[11px] !text-white sm:text-xs">
              Quality products · Trusted service
            </p>

          <div className="hidden items-center gap-4 text-xs sm:flex">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="!text-white transition-colors duration-300 hover:text-[#D6B56D]">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="!text-white transition-colors duration-300 hover:text-[#D6B56D]">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="!text-white transition-colors duration-300 hover:text-[#D6B56D]">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <Link
              to="/track-order"
              className="!text-white transition-colors duration-300 hover:!text-[#D6B56D]"
            >
              Track Order
            </Link>

            <Link
              to="/help"
              className="!text-white transition-colors duration-300 hover:text-[#D6B56D]"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`header-wrapper sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-[#D6B56D]/40 bg-[#173D35]/95 backdrop-blur-xl shadow-lg shadow-[#173D35]/10"
            : "bg-[#173D35]"
        }`}
      >
        <div className="mx-auto flex flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:gap-8 lg:px-10 lg:py-4">
          <Link to="/" className="shrink-0">
            {storefront?.websiteLogo ? <img src={storefront.websiteLogo} alt={storefront.businessName || STORE_NAME} className="h-10 w-auto max-w-[160px] object-cover" /> : <p className="whitespace-nowrap font-[inter] text-xl font-bold tracking-tight !text-white sm:text-2xl">{storefront?.businessName || STORE_NAME}</p>}
          </Link>

          <div className="order-3 flex w-full items-center rounded-full border border-[#D6B56D]/40 bg-white/95 px-4 py-2.5 transition-all duration-300 focus-within:border-[#D6B56D] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#D6B56D]/15 lg:order-none lg:mx-auto lg:max-w-4xl">
            <i className="fa-solid fa-magnifying-glass mr-3 text-sm text-[#173D35]"></i>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search products"
              placeholder="Search products, brands & more..."
              className="w-full bg-transparent text-sm text-[#173D35] outline-none placeholder:text-[#173D35]/60"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2">
            <Link
              to="/account"
              className="flex h-9 w-9 items-center justify-center rounded-xl !text-white transition-all duration-300 hover:bg-[#D6B56D]/20 hover:text-[#D6B56D] sm:h-10 sm:w-10"
              title="Account"
            >
              <i className="fa-regular fa-user"></i>
            </Link>

            <Link
              to="/orders"
              aria-label="My orders"
              className="flex h-9 w-9 items-center justify-center rounded-xl !text-white transition-all duration-300 hover:bg-[#D6B56D]/20 hover:text-[#D6B56D] sm:h-10 sm:w-10"
              title="Orders"
            >
              <i className="fa-solid fa-box" />
            </Link>

            <Link
              to="/favorite"
              aria-label="Wishlist"
              className="h-10 flex w-10 items-center justify-center rounded-xl !text-white transition-all duration-300 hover:bg-[#D6B56D]/20 hover:text-[#D6B56D] sm:flex"
              title="Wishlist"
            >
              <i className="fa-regular fa-heart"></i>
            </Link>

            <Link
              to="/cart"
              aria-label={`Shopping cart, ${cartItemCount} items`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl !text-white transition-all duration-300 hover:bg-[#D6B56D]/20 hover:text-[#D6B56D] sm:h-10 sm:w-10"
              title="Cart"
            >
              <i className="fa-solid fa-bag-shopping"></i>

              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D6B56D] px-1 text-[10px] font-semibold text-[#173D35] ring-1 ring-[#173D35]/20">
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
