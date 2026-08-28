import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-wrapper border-t-2 border-gray-200 bg-[#FFFFFF]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-0">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">

          {/* Left Section */}
          <div className="w-full lg:max-w-sm">
            <div className="footer-logo">
              <Link to="/" className="inline-block">
                <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                  Vendor<span className="text-[#6c3bff]">Aflame</span>
                </p>
              </Link>

              <div className="mt-4 font-[Inter] text-sm leading-6 text-[#6B7280]">
                <p>
                  Marqo is the marketplace where thousands of trusted vendors
                  meet millions of shoppers. Discover more, pay less, sell
                  smarter.
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
                  Paypal
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:max-w-3xl">

            {/* Shop */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Shop
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/">New Arrivals</Link>
                <Link className="footer-link" to="/">Best Sellers</Link>
                <Link className="footer-link" to="/">Deals & Offers</Link>
                <Link className="footer-link" to="/">Gift Cards</Link>
                <Link className="footer-link" to="/">Brands</Link>
              </div>
            </div>

            {/* Sell */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Sell
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/">Start Selling</Link>
                <Link className="footer-link" to="/">Seller Dashboard</Link>
                <Link className="footer-link" to="/">Food & Pricing</Link>
                <Link className="footer-link" to="/">Seller Academy</Link>
                <Link className="footer-link" to="/">Fulfillment</Link>
              </div>
            </div>

            {/* Support */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Support
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/">Help Center</Link>
                <Link className="footer-link" to="/">Track Order</Link>
                <Link className="footer-link" to="/">Returns & Refunds</Link>
                <Link className="footer-link" to="/">Shipping Info</Link>
                <Link className="footer-link" to="/">Contact Us</Link>
              </div>
            </div>

            {/* Company */}
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold text-[#171717]">
                Company
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/">About Marqo</Link>
                <Link className="footer-link" to="/">Careers</Link>
                <Link className="footer-link" to="/">Press</Link>
                <Link className="footer-link" to="/">Sustainability</Link>
                <Link className="footer-link" to="/">Investors</Link>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="font-[Inter] text-xs text-[#9CA3AF]">
              © 2026 VendorAflame. All rights reserved.
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

      {/* Tailwind reusable class */}
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