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
    <footer className="footer-wrapper border-t border-[#D6B56D]/40 bg-[#173D35]">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* Left Section */}
          <div className="w-full lg:max-w-sm">
            <div className="footer-logo">
              <Link to="/" className="inline-block">
                {storefront?.websiteLogo ? (
                  <img
                    src={storefront.websiteLogo}
                    alt={storeName}
                    className="h-10 w-auto max-w-[160px] object-contain object-left"
                  />
                ) : (
                  <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight !text-white sm:text-2xl">
                    {storeName}
                  </p>
                )}
              </Link>

              <div className="mt-4 font-[Inter] text-sm leading-6 text-gray-200">
                <p>
                  Discover quality products and enjoy a smarter shopping
                  experience with {storeName}.
                </p>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#D6B56D]">Follow us</p>
                <div className="flex items-center gap-3">
                  <a href="https://www.facebook.com/share/19jvptk8wZ/?mibextid=wwXIfr" target="_blank" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6B56D]/40 !text-white transition hover:border-[#D6B56D] hover:text-[#D6B56D]">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                  <a href="https://www.instagram.com/newmeeraplasticandcrockery?srtk=MWVjN2EwdzFrMnJ3MA%3D%3D&utm_source=qr" target="_blank" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6B56D]/40 !text-white transition hover:border-[#D6B56D] hover:text-[#D6B56D]">
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a href="#" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6B56D]/40 !text-white transition hover:border-[#D6B56D] hover:text-[#D6B56D]">
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6B56D]/40 !text-white transition hover:border-[#D6B56D] hover:text-[#D6B56D]">
                    <i className="fa-brands fa-youtube" />
                  </a>
                </div>
              </div>

              {/* Payment Methods */}
            
            </div>
          </div>
          {/* Footer Links */}
          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 lg:max-w-3xl lg:grid-cols-3">
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold !text-white">Pages</h3>
              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/">Home</Link>
                <Link className="footer-link" to="/orders">Orders</Link>
                <Link className="footer-link" to="/account">Profile</Link>
                <Link className="footer-link" to="/favorite">Wishlist</Link>
              </div>
            </div>
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold !text-white">
                Support
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                <Link className="footer-link" to="/orders">
                  My Orders
                </Link>
                <Link className="footer-link" to="/track-order">
                  Track Order
                </Link>
                <Link className="footer-link" to="/contact">
                  Help & Contact Support
                </Link>
                <Link className="footer-link" to="/term&condition">
                  Terms & Conditions
                </Link>
              </div>
            </div>
            <div className="footer-links">
              <h3 className="font-[Inter] text-sm font-semibold !text-white">Contact Details</h3>
              <div className="mt-4 flex flex-col gap-3">
                {storefront?.contactEmail && <a className="footer-link break-words" href={`mailto:${storefront.contactEmail}`}>{storefront.contactEmail}</a>}
                {storefront?.contactPhone && <a className="footer-link" href={`tel:${storefront.contactPhone}`}>{storefront.contactPhone}</a>}
                {storefront?.contactAddress && <a className="footer-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storefront.contactAddress)}`} target="_blank" rel="noreferrer">{storefront.contactAddress}</a>}
                {!storefront?.contactEmail && !storefront?.contactPhone && !storefront?.contactAddress && <Link className="footer-link" to="/contact">Contact Support</Link>}
              </div>
            </div>
          </div>{" "}
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-[#D6B56D]/30 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="font-[Inter] text-xs text-gray-300">
             ©{copyright} | all rights reserved
            </p>

            <div className="flex gap-5">
              <Link
                to="/term&condition"
                className="font-[Inter] text-xs text-gray-300 transition-colors duration-300 hover:text-[#D6B56D]"
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
            color: #e5e7eb;
            transition: color 300ms ease;
          }

          .footer-link:hover {
            color: #D6B56D;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
