import React from "react";
import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div className="ctgry-wrapper my-10">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">

          <Link
            to="/category/electronics"
            className="ctgry-1 group flex w-full flex-col items-center justify-center rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-4 py-4 hover:border-[#6C3BFF] hover:bg-[#EFEEFC] transition-colors duration-200"
          >
            <div className="rounded-2xl bg-[#EFEEFC] p-3 transition-colors duration-100 group-hover:bg-[#6C3BFF]">
              <i className="fa-regular fa-camera text-xl font-extralight text-[#6C3BFF] transition-colors duration-100 group-hover:text-white"></i>
            </div>
            <p className="mt-2 font-[inter] text-sm font-bold">Electronics</p>
          </Link>

          <Link
            to="/category/fashion"
            className="ctgry-1 group flex w-full flex-col items-center justify-center rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-4 py-4 hover:border-[#6C3BFF] hover:bg-[#EFEEFC] transition-colors duration-200"
          >
            <div className="rounded-2xl bg-[#EFEEFC] p-3 transition-colors duration-100 group-hover:bg-[#6C3BFF]">
              <i className="fa-solid fa-shirt text-xl font-extralight text-[#6C3BFF] transition-colors duration-100 group-hover:text-white"></i>
            </div>
            <p className="mt-2 font-[inter] text-sm font-bold">Fashion</p>
          </Link>

          <Link
            to="/category/home-living"
            className="ctgry-1 group flex w-full flex-col items-center justify-center rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-4 py-4 hover:border-[#6C3BFF] hover:bg-[#EFEEFC] transition-colors duration-200"
          >
            <div className="rounded-2xl bg-[#EFEEFC] p-3 transition-colors duration-100 group-hover:bg-[#6C3BFF]">
              <i className="fa-solid fa-house text-xl font-extralight text-[#6C3BFF] transition-colors duration-100 group-hover:text-white"></i>
            </div>
            <p className="mt-2 text-center font-[inter] text-sm font-bold">Home & Living</p>
          </Link>

          <Link
            to="/category/beauty"
            className="ctgry-1 group flex w-full flex-col items-center justify-center rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-4 py-4 hover:border-[#6C3BFF] hover:bg-[#EFEEFC] transition-colors duration-200"
          >
            <div className="rounded-2xl bg-[#EFEEFC] p-3 transition-colors duration-100 group-hover:bg-[#6C3BFF]">
              <i className="fa-solid fa-person-dress text-xl font-extralight text-[#6C3BFF] transition-colors duration-100 group-hover:text-white"></i>
            </div>
            <p className="mt-2 font-[inter] text-sm font-bold">Beauty</p>
          </Link>

          <Link
            to="/category/sports"
            className="ctgry-1 group flex w-full flex-col items-center justify-center rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-4 py-4 hover:border-[#6C3BFF] hover:bg-[#EFEEFC] transition-colors duration-200"
          >
            <div className="rounded-2xl bg-[#EFEEFC] p-3 transition-colors duration-100 group-hover:bg-[#6C3BFF]">
              <i className="fa-solid fa-dumbbell text-xl font-extralight text-[#6C3BFF] transition-colors duration-100 group-hover:text-white"></i>
            </div>
            <p className="mt-2 font-[inter] text-sm font-bold">Sports</p>
          </Link>

          <Link
            to="/category/accessories"
            className="ctgry-1 group flex w-full flex-col items-center justify-center rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-4 py-4 hover:border-[#6C3BFF] hover:bg-[#EFEEFC] transition-colors duration-200"
          >
            <div className="rounded-2xl bg-[#EFEEFC] p-3 transition-colors duration-100 group-hover:bg-[#6C3BFF]">
              <i className="fa-solid fa-ring text-xl font-extralight text-[#6C3BFF] transition-colors duration-100 group-hover:text-white"></i>
            </div>
            <p className="mt-2 font-[inter] text-sm font-bold">Accessories</p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Category;