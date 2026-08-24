import React from "react";
import Shoes from "../assets/images/close-up-futuristic-sneakers-showcase.jpg";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "AeroGlide Pro Running Sneakers",
    store: "Ksetra",
    price: "$999",
    oldPrice: "$1200",
    discount: "-26% OFF",
    rating: "4.8",
    reviews: "2,413",
  },
  {
    id: 2,
    name: "AeroGlide Pro Running Sneakers",
    store: "Ksetra",
    price: "$999",
    oldPrice: "$1200",
    discount: "-26% OFF",
    rating: "4.8",
    reviews: "2,413",
  },
  {
    id: 3,
    name: "AeroGlide Pro Running Sneakers",
    store: "Ksetra",
    price: "$999",
    oldPrice: "$1200",
    discount: "-26% OFF",
    rating: "4.8",
    reviews: "2,413",
  },
  {
    id: 4,
    name: "AeroGlide Pro Running Sneakers",
    store: "Ksetra",
    price: "$999",
    oldPrice: "$1200",
    discount: "-26% OFF",
    rating: "4.8",
    reviews: "2,413",
  },
];

const Product = () => {
  return (
    <div className="product-wrapper my-8 sm:my-12 md:my-15">
      <div className="mx-auto w-full px-3 sm:px-6 md:px-10 lg:px-15">
        
        {/* ================= PRODUCT HEADER ================= */}
        <div className="product-head flex items-end justify-between gap-3">
          <div>
            <h3 className="font-[inter] text-xl font-bold text-[#000000] sm:text-2xl md:text-3xl">
              Deals of the Day
            </h3>

            <p className="mt-1 font-[inter] text-[11px] text-[#6B7280] sm:mt-2 sm:text-sm">
              Limited-time offers, refreshed every 24 hours
            </p>
          </div>

          <Link
            to="/products"
            className="flex shrink-0 items-center gap-1 font-[inter] text-[11px] font-semibold text-[#6C3BFF] transition duration-200 hover:text-[#421db3] sm:text-sm"
          >
            View All
            <i className="fa-solid fa-arrow-right text-[10px] sm:text-xs"></i>
          </Link>
        </div>

        {/* ================= PRODUCT CARDS ================= */}
        <div className="product-cards my-6 grid grid-cols-2 gap-3 sm:my-8 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#dde3f0] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#b6a5e7] hover:shadow-lg sm:rounded-[20px]"
            >
              
              {/* ================= PRODUCT IMAGE ================= */}
              <div className="relative overflow-hidden">
                <img
                  src={Shoes}
                  alt={product.name}
                  className="h-40 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-60 md:h-64 lg:h-72 xl:h-80"
                />

                {/* Badges */}
                <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-2">
                  <span className="rounded-full bg-[#6C3BFF] px-2 py-1 font-[inter] text-[8px] font-semibold text-white sm:px-3 sm:text-xs">
                    BestSeller
                  </span>

                  <span className="rounded-full bg-[#FFB020] px-2 py-1 font-[inter] text-[8px] font-semibold text-black sm:px-3 sm:text-xs">
                    {product.discount}
                  </span>
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition duration-200 hover:bg-[#6C3BFF] hover:text-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                >
                  <i className="fa-regular fa-heart text-[11px] sm:text-sm"></i>
                </button>
              </div>

              {/* ================= PRODUCT CONTENT ================= */}
              <div className="flex flex-1 flex-col p-2.5 sm:p-3 md:p-4">
                
                {/* Store */}
                <span className="font-[inter] text-[9px] text-[#6B7280] sm:text-xs">
                  {product.store}
                </span>

                {/* Product Name */}
                <h4 className="mt-1 line-clamp-2 min-h-[30px] font-[inter] text-[11px] font-bold leading-4 text-[#111827] transition duration-200 group-hover:text-[#6C3BFF] sm:min-h-[40px] sm:text-sm sm:leading-5">
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="mt-1.5 flex items-center gap-1 sm:mt-2 sm:gap-1.5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className="fa-solid fa-star text-[8px] text-[#FFB020] sm:text-[10px]"
                      ></i>
                    ))}
                  </div>

                  <span className="font-[inter] text-[9px] font-medium text-[#111827] sm:text-xs">
                    {product.rating}
                  </span>

                  <span className="font-[inter] text-[8px] text-[#6B7280] sm:text-xs">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price + Cart */}
                <div className="mt-3 flex items-center justify-between gap-1 sm:mt-5">
                  <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <span className="font-[inter] text-xs font-bold text-[#111827] sm:text-sm md:text-base">
                      {product.price}
                    </span>

                    <span className="truncate font-[inter] text-[8px] text-[#6B7280] line-through sm:text-xs">
                      {product.oldPrice}
                    </span>
                  </div>

                  <Link
                    to="/cart"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6C3BFF] text-white transition duration-200 hover:bg-[#421db3] sm:h-9 sm:w-9 sm:rounded-xl"
                  >
                    <i className="fa-solid fa-bag-shopping text-[10px] sm:text-sm"></i>
                  </Link>
                </div>

                {/* Shipping */}
                <p className="mt-2 font-[inter] text-[9px] font-medium text-green-600 sm:mt-3 sm:text-xs">
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