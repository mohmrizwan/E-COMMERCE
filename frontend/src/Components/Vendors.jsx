import React from "react";
import { Link } from "react-router-dom";

const Vendors = () => {
  return (
    <div className="vendors-wrapper">
      <div className="mx-auto px-15">
        <div className="product-head flex items-center justify-between gap-4">
          <div>
            <h3 className="font-[inter] text-2xl font-bold text-[#000000] sm:text-3xl">
              Top-rated vendors
            </h3>

            <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
              Trusted sellers with thousands of happy customers
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/"
              className="font-[inter] text-xs font-semibold text-[#6C3BFF] transition duration-150 hover:text-[#421db3] sm:text-sm"
            >
              Explore All Vendors&nbsp;
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
