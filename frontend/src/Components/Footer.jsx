import React from "react";
import { Link } from "react-router-dom";
import { STORE_NAME } from "../config/brand.js";
import { useStorefront } from "../hooks/useStorefront.js";

const Footer = () => {
  const storefront = useStorefront();
  const storeName = storefront?.businessName || STORE_NAME;
  const copyright =
    storefront?.footerText ||
    `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`;
  return (
    <footer className="footer-wrapper border-t-2 border-gray-200 bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-0">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* Left Section */}
          <div className="w-full lg:max-w-sm">
            <div className="footer-logo">
              <Link to="/" className="inline-block">
                {storefront?.websiteLogo ? (
                  <img
                    src={storefront.websiteLogo}
                    alt={storeName}
                    className="h-10 max-w-48 object-contain object-left"
                  />
                ) : (
                  <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                    {storeName}
                  </p>
                )}
              </Link>

              <div className="mt-4 font-[Inter] text-sm leading-6 text-[#6B7280]">
                <p>
                  Discover quality products and enjoy a smarter shopping
                  experience with {storeName}.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="mt-5 flex flex-wrap gap-3">
                <p className="rounded-2xl border border-[#EEDCE0] px-3 py-2 text-xs font-semibold text-[#6B7280]">
                  Visa
                </p>

                <p className="rounded-2xl border border-[#EEDCE0] px-3 py-2 text-xs font-semibold text-[#6B7280]">
                  MC
                </p>

                <p className="rounded-2xl border border-[#EEDCE0] px-3 py-2 text-xs font-semibold text-[#6B7280]">
                  Amex
                </p>

                <p className="rounded-2xl border border-[#EEDCE0] px-3 py-2 text-xs font-semibold text-[#6B7280]">
                  PayPal
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}

          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10 lg:max-w-3xl">
            {/* Shop */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Shop
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/products">
                  All Products
                </Link>

                <Link className="footer-link" to="/products?sort=newest">
                  New Arrivals
                </Link>

                <Link className="footer-link" to="/products?sort=popular">
                  Best Sellers
                </Link>

                <Link className="footer-link" to="/categories">
                  Categories
                </Link>

                <Link className="footer-link" to="/products?offer=true">
                  Deals & Offers
                </Link>

                <Link className="footer-link" to="/cart">
                  Shopping Cart
                </Link>

                <Link className="footer-link" to="/wishlist">
                  Wishlist
                </Link>
              </div>
            </div>

            {/* Customer Support */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Customer Support
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/contact">
                  Contact Us
                </Link>

                <Link className="footer-link" to="/orders">
                  My Orders
                </Link>

                <Link className="footer-link" to="/track-order">
                  Track Order
                </Link>

                <Link className="footer-link" to="/shipping-policy">
                  Shipping Policy
                </Link>

                <Link className="footer-link" to="/returns-refunds">
                  Returns & Refunds
                </Link>

                <Link className="footer-link" to="/faq">
                  FAQs
                </Link>
              </div>
            </div>

            {/* About */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                About Us
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/about">
                  Our Story
                </Link>

                <Link className="footer-link" to="/contact">
                  Store Information
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Legal
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/privacy-policy">
                  Privacy Policy
                </Link>

                <Link className="footer-link" to="/terms-and-conditions">
                  Terms & Conditions
                </Link>

                <Link className="footer-link" to="/cancellation-policy">
                  Cancellation Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="font-[Inter] text-xs text-[#9CA3AF]">
              {copyright} | All rights reserved.
            </p>

            <div className="flex gap-5">
              <Link
                to="/privacy-policy"
                className="font-[Inter] text-xs text-[#9CA3AF] transition-colors duration-300 hover:text-[#6c3bff]"
              >
                Privacy Policy
              </Link>

              <Link
                to="/term&condition"
                className="font-[Inter] text-xs text-[#9CA3AF] transition-colors duration-300 hover:text-[#6c3bff]"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .footer-link {
            font-family: Inter, sans-serif;
            font-size: 0.875rem;
            color: #6B7280;
            transition: color 300ms ease;
          }

          .footer-link:hover {
            color: #6c3bff;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
