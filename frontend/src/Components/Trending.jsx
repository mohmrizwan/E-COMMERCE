import React from "react";
import Shoes from "../assets/images/close-up-futuristic-sneakers-showcase.jpg";
import { Link } from "react-router-dom";

const products = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
];

const Product = () => {
  return (
    <div className="product-wrapper my-8 sm:my-12 md:my-15">
      <div className="mx-auto w-full px-3 sm:px-6 md:px-10 lg:px-15">
        
        {/* Product Header */}
        <div className="product-head flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-[inter] text-xl font-bold text-[#000000] sm:text-2xl md:text-3xl">
              Trending Now
            </h3>

            <p className="my-1 font-[inter] text-[10px] text-[#6B7280] sm:my-2 sm:text-sm">
              What millions of shoppers are loving this week
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/products"
              className="flex items-center gap-1 font-[inter] text-[10px] font-semibold text-[#6C3BFF] transition duration-150 hover:text-[#421db3] sm:text-sm"
            >
              View All
              <i className="fa-solid fa-arrow-right text-[9px] sm:text-xs"></i>
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <div className="product-cards my-6 grid grid-cols-2 gap-3 sm:my-8 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#dde3f0] bg-white transition duration-200 hover:border-[#b6a5e7] hover:shadow-md sm:rounded-[20px]"
            >
              
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={Shoes}
                  alt="product-image"
                  className="h-40 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-60 md:h-64 lg:h-72 xl:h-80"
                />

                {/* Badges */}
                <div className="absolute left-2 top-2 z-10 sm:left-3 sm:top-3">
                  <p className="w-fit rounded-full bg-[#6C3BFF] px-2 py-1 font-[inter] text-[7px] font-semibold text-white sm:px-3 sm:text-xs">
                    BestSeller
                  </p>

                  <p className="my-1 w-fit rounded-full bg-[#FFB020] px-2 py-1 font-[inter] text-[7px] font-semibold text-black sm:my-2 sm:px-3 sm:text-xs">
                    -26% OFF
                  </p>

                  <p className="w-fit rounded-full bg-[#FFB020] px-2 py-1 font-[inter] text-[7px] font-semibold text-black sm:px-3 sm:text-xs">
                    Limited
                  </p>
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                >
                  <i className="fa-regular fa-heart cursor-pointer text-[10px] font-semibold text-[#6B7280] transition duration-200 hover:text-red-500 sm:text-sm"></i>
                </button>
              </div>

              {/* Product Content */}
              <div className="flex flex-1 flex-col bg-white p-2.5 sm:p-3">
                
                {/* Vendor */}
                <span className="font-[inter] text-[9px] text-[#6B7280] sm:text-xs">
                  Ksetra
                </span>

                {/* Product Name */}
                <p className="mt-1 line-clamp-2 min-h-[30px] font-[inter] text-[10px] font-bold leading-4 transition duration-200 hover:text-[#6C3BFF] sm:min-h-[40px] sm:text-sm sm:leading-5">
                  AeroGlide Pro Running Sneakers
                </p>

                {/* Rating */}
                <div className="mt-1.5 flex items-center gap-1 sm:mt-2 sm:gap-1.5">
                  <div className="flex">
                    <i className="fa-solid fa-star text-[7px] text-[gold] sm:text-[10px]"></i>
                    <i className="fa-solid fa-star text-[7px] text-[gold] sm:text-[10px]"></i>
                    <i className="fa-solid fa-star text-[7px] text-[gold] sm:text-[10px]"></i>
                    <i className="fa-solid fa-star text-[7px] text-[gold] sm:text-[10px]"></i>
                    <i className="fa-solid fa-star text-[7px] text-[gold] sm:text-[10px]"></i>
                  </div>

                  <span className="font-[inter] text-[8px] font-medium sm:text-xs">
                    4.8
                  </span>

                  <span className="font-[inter] text-[8px] text-[#6B7280] sm:text-xs">
                    (2,413)
                  </span>
                </div>

                {/* Price + Cart */}
                <div className="mt-3 flex items-center justify-between gap-1 sm:my-5 sm:gap-3">
                  <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <span className="font-[inter] text-xs font-bold sm:text-sm">
                      $999
                    </span>

                    <span className="truncate font-[inter] text-[8px] text-[#6B7280] line-through sm:text-xs">
                      $1200
                    </span>
                  </div>

                  <Link
                    to="/cart"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6C3BFF] text-white transition duration-300 hover:bg-[#421db3] sm:h-9 sm:w-9 sm:rounded-xl"
                  >
                    <i className="fa-solid fa-bag-shopping text-[9px] sm:text-sm"></i>
                  </Link>
                </div>

                {/* Shipping */}
                <p className="mt-auto font-[inter] text-[9px] text-green-600 sm:text-xs">
                  Free shipping
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Product;