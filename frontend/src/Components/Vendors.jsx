import React from "react";
import { Link } from "react-router-dom";

const Vendors = () => {
  const vendors = [1, 2, 3, 4];

  return (
    <div className="vendors-wrapper">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
        
        {/* Heading */}
        <div className="product-head flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
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

        {/* Cards */}
        <div className="product-cards my-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {vendors.map((vendor) => (
            <div
              key={vendor}
              className="product-card w-full rounded-2xl border border-[#dde3f0] bg-white px-3 transition duration-150 hover:border-[#b6a5e7]"
            >
              {/* Vendor Header */}
              <div className="my-5 flex w-full items-center justify-start gap-3">
                
                <div className="logo shrink-0 rounded-3xl bg-[#F0EBFF] px-3 py-2">
                  <p className="font-[inter] text-lg font-bold text-[#6C3BFF]">
                    K
                  </p>
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-[inter] font-bold">
                    Kestra Athletics
                  </h2>

                  <p className="text-xs text-[#6B7280]">
                    Since 2019
                  </p>
                </div>

              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-gray-300"></div>

              {/* Bottom */}
              <div className="flex w-full items-center justify-between p-4">
                
                <div className="text-xs">
                  <i className="fa-solid fa-star text-xs text-[gold]"></i>
                  &nbsp;4.8
                </div>

                <div className="text-xs text-[#6B7280]">
                  128 Products
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Vendors;