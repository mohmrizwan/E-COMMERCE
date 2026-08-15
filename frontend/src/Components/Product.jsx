import React from "react";
import Shoes from "../assets/images/close-up-futuristic-sneakers-showcase.jpg";
import { Link } from "react-router-dom";

const Product = () => {
  return (
    <div className="product-wrapper my-10 sm:my-12 md:my-15">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">

        {/* Product Header */}
        <div className="product-head flex items-center justify-between gap-4">
          <div>
            <h3 className="font-[inter] text-2xl font-bold text-[#000000] sm:text-3xl">
              Deals of the Day
            </h3>

            <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
              Limited-time offers, refreshed every 24 hours
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/"
              className="font-[inter] text-xs font-semibold text-[#6C3BFF] transition duration-150 hover:text-[#421db3] sm:text-sm"
            >
              View All&nbsp;
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <div className="product-cards my-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Product 1 */}
          <div className="product-card group relative w-full overflow-hidden rounded-[20px] border border-[#dde3f0] transition duration-150 hover:border-[#b6a5e7]">

            <div className="overflow-hidden">
              <img
                src={Shoes}
                alt="product-image"
                className="relative h-80 w-full rounded-tl-[20px] rounded-tr-[20px] object-cover object-center transition-transform duration-500 group-hover:scale-105] sm:h-90"
              />
            </div>

            {/* Badges */}
            <div className="absolute left-3 top-3 z-10">
              <p className="w-fit rounded-2xl bg-[#6C3BFF] px-3 py-1 font-[inter] text-xs text-white">
                BestSeller
              </p>

              <p className="my-2 w-fit rounded-2xl bg-[#FFB020] px-3 py-1 font-[inter] text-xs font-semibold text-[#000000]">
                -26% OFF
              </p>
            </div>

            {/* Wishlist */}
            <div className="absolute right-3 top-3 z-10 rounded-[50%] bg-white p-2">
              <i className="fa-regular fa-heart cursor-pointer text-sm font-semibold text-[#6B7280] transition duration-100 hover:text-red-500"></i>
            </div>

            {/* Content */}
            <div className="bg-[#FFFFFF] p-3">

              <a className="font-[inter] text-xs text-[#6B7280]">
                Ksetra
              </a>

              <p className="font-[inter] text-sm font-bold transition duration-200 hover:text-[#6C3BFF]">
                AeroGlide Pro Running Sneakers
              </p>

              {/* Rating */}
              <div className="mt-1">
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-regular fa-star text-xs text-[gold]"></i>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">
                  4.8
                </span>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">
                  (2,413)
                </span>
              </div>

              {/* Price */}
              <div className="my-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-[inter] text-sm font-bold">
                    $999
                  </span>

                  <span className="font-[inter] text-xs text-[#6B7280] line-through">
                    $1200
                  </span>
                </div>

                <Link
                  to="/"
                  className="shrink-0 rounded-xl bg-[#6C3BFF] p-2 font-bold text-white transition duration-300 hover:bg-[#421db3]"
                >
                  <i className="fa-solid fa-bag-shopping text-sm"></i>
                </Link>
              </div>

              <p className="font-[inter] text-xs text-green-600">
                Free shipping
              </p>

            </div>
          </div>

          {/* Product 2 */}
          <div className="product-card group relative w-full overflow-hidden rounded-[20px] border border-[#dde3f0] transition duration-150 hover:border-[#b6a5e7]">

            <div className="overflow-hidden">
              <img
                src={Shoes}
                alt="product-image"
                className="relative h-80 w-full rounded-tl-[20px] rounded-tr-[20px] object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-90"
              />
            </div>

            <div className="absolute left-3 top-3 z-10">
              <p className="w-fit rounded-2xl bg-[#6C3BFF] px-3 py-1 font-[inter] text-xs text-white">
                BestSeller
              </p>

              <p className="my-2 w-fit rounded-2xl bg-[#FFB020] px-3 py-1 font-[inter] text-xs font-semibold text-[#000000]">
                -26% OFF
              </p>
            </div>

            <div className="absolute right-3 top-3 z-10 rounded-[50%] bg-white p-2">
              <i className="fa-regular fa-heart cursor-pointer text-sm font-semibold text-[#6B7280] transition duration-100 hover:text-red-500"></i>
            </div>

            <div className="bg-[#FFFFFF] p-3">

              <a className="font-[inter] text-xs text-[#6B7280]">
                Ksetra
              </a>

              <p className="font-[inter] text-sm font-bold transition duration-200 hover:text-[#6C3BFF]">
                AeroGlide Pro Running Sneakers
              </p>

              <div className="mt-1">
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-regular fa-star text-xs text-[gold]"></i>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">4.8</span>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">(2,413)</span>
              </div>

              <div className="my-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-[inter] text-sm font-bold">$999</span>

                  <span className="font-[inter] text-xs text-[#6B7280] line-through">
                    $1200
                  </span>
                </div>

                <Link
                  to="/"
                  className="shrink-0 rounded-xl bg-[#6C3BFF] p-2 font-bold text-white transition duration-300 hover:bg-[#421db3]"
                >
                  <i className="fa-solid fa-bag-shopping text-sm"></i>
                </Link>
              </div>

              <p className="font-[inter] text-xs text-green-600">
                Free shipping
              </p>

            </div>
          </div>

          {/* Product 3 */}
          <div className="product-card group relative w-full overflow-hidden rounded-[20px] border border-[#dde3f0] transition duration-150 hover:border-[#b6a5e7]">

            <div className="overflow-hidden">
              <img
                src={Shoes}
                alt="product-image"
                className="relative h-80 w-full rounded-tl-[20px] rounded-tr-[20px] object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-90"
              />
            </div>

            <div className="absolute left-3 top-3 z-10">
              <p className="w-fit rounded-2xl bg-[#6C3BFF] px-3 py-1 font-[inter] text-xs text-white">
                BestSeller
              </p>

              <p className="my-2 w-fit rounded-2xl bg-[#FFB020] px-3 py-1 font-[inter] text-xs font-semibold text-[#000000]">
                -26% OFF
              </p>
            </div>

            <div className="absolute right-3 top-3 z-10 rounded-[50%] bg-white p-2">
              <i className="fa-regular fa-heart cursor-pointer text-sm font-semibold text-[#6B7280] transition duration-100 hover:text-red-500"></i>
            </div>

            <div className="bg-[#FFFFFF] p-3">

              <a className="font-[inter] text-xs text-[#6B7280]">
                Ksetra
              </a>

              <p className="font-[inter] text-sm font-bold transition duration-200 hover:text-[#6C3BFF]">
                AeroGlide Pro Running Sneakers
              </p>

              <div className="mt-1">
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-regular fa-star text-xs text-[gold]"></i>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">4.8</span>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">(2,413)</span>
              </div>

              <div className="my-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-[inter] text-sm font-bold">$999</span>

                  <span className="font-[inter] text-xs text-[#6B7280] line-through">
                    $1200
                  </span>
                </div>

                <Link
                  to="/"
                  className="shrink-0 rounded-xl bg-[#6C3BFF] p-2 font-bold text-white transition duration-300 hover:bg-[#421db3]"
                >
                  <i className="fa-solid fa-bag-shopping text-sm"></i>
                </Link>
              </div>

              <p className="font-[inter] text-xs text-green-600">
                Free shipping
              </p>

            </div>
          </div>

          {/* Product 4 */}
          <div className="product-card group relative w-full overflow-hidden rounded-[20px] border border-[#dde3f0] transition duration-150 hover:border-[#b6a5e7]">

            <div className="overflow-hidden">
              <img
                src={Shoes}
                alt="product-image"
                className="relative h-80 w-full rounded-tl-[20px] rounded-tr-[20px] object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-90"
              />
            </div>

            <div className="absolute left-3 top-3 z-10">
              <p className="w-fit rounded-2xl bg-[#6C3BFF] px-3 py-1 font-[inter] text-xs text-white">
                BestSeller
              </p>

              <p className="my-2 w-fit rounded-2xl bg-[#FFB020] px-3 py-1 font-[inter] text-xs font-semibold text-[#000000]">
                -26% OFF
              </p>
            </div>

            <div className="absolute right-3 top-3 z-10 rounded-[50%] bg-white p-2">
              <i className="fa-regular fa-heart cursor-pointer text-sm font-semibold text-[#6B7280] transition duration-100 hover:text-red-500"></i>
            </div>

            <div className="bg-[#FFFFFF] p-3">

              <a className="font-[inter] text-xs text-[#6B7280]">
                Ksetra
              </a>

              <p className="font-[inter] text-sm font-bold transition duration-200 hover:text-[#6C3BFF]">
                AeroGlide Pro Running Sneakers
              </p>

              <div className="mt-1">
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-solid fa-star text-xs text-[gold]"></i>
                <i className="fa-regular fa-star text-xs text-[gold]"></i>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">4.8</span>

                &nbsp;&nbsp;

                <span className="font-[inter] text-xs">(2,413)</span>
              </div>

              <div className="my-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-[inter] text-sm font-bold">$999</span>

                  <span className="font-[inter] text-xs text-[#6B7280] line-through">
                    $1200
                  </span>
                </div>

                <Link
                  to="/"
                  className="shrink-0 rounded-xl bg-[#6C3BFF] p-2 font-bold text-white transition duration-300 hover:bg-[#421db3]"
                >
                  <i className="fa-solid fa-bag-shopping text-sm"></i>
                </Link>
              </div>

              <p className="font-[inter] text-xs text-green-600">
                Free shipping
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;
