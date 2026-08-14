import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import banner from "../assets/images/banner.jpg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
       
        navigation={true}
        modules={[Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="flex flex-col-reverse gap-8 px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-15">

            {/* LEFT CONTENT */}
            <div className="banner-ls w-full lg:w-1/2">

              {/* Badge */}
              <div className="sub-title flex w-fit rounded-2xl bg-[#F0EBFF] px-3 py-1">
                <p className="font-inter text-xs font-bold text-[#6C5CFF]">
                  <i className="fa-solid fa-star"></i>
                  &nbsp;&nbsp;Over 12M shoppers · 40k+ vendors
                </p>
              </div>

              {/* Heading */}
              <div className="my-6 sm:my-8 lg:my-10">
                <h1 className="font-inter text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Everything you love, from sellers you can{" "}
                  <span className="text-[#6C3BFF]">trust</span>.
                </h1>
              </div>

              {/* Description */}
              <div className="my-5 max-w-xl">
                <p className="font-inter text-sm leading-6 text-[#6B7280] sm:text-base">
                  One marketplace for millions of products across electronics,
                  fashion, home and more — curated from the world's best
                  independent vendors.
                </p>
              </div>

              {/* Buttons */}
              <div className="my-6 flex flex-wrap gap-3 sm:my-7 sm:gap-5">
                <Link
                  to="/start"
                  className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  Start Shopping&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff]"
                >
                  <span>Become a seller</span>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-regular fa-truck text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Free shipping over $50
                </p>

                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-solid fa-shield text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Buyer protection
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="banner-rs h-[250px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] lg:w-1/2">
              <img
                src={banner}
                alt="banner-img"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col-reverse gap-8 px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-15">

            {/* LEFT CONTENT */}
            <div className="banner-ls w-full lg:w-1/2">

              {/* Badge */}
              <div className="sub-title flex w-fit rounded-2xl bg-[#F0EBFF] px-3 py-1">
                <p className="font-inter text-xs font-bold text-[#6C5CFF]">
                  <i className="fa-solid fa-star"></i>
                  &nbsp;&nbsp;Over 12M shoppers · 40k+ vendors
                </p>
              </div>

              {/* Heading */}
              <div className="my-6 sm:my-8 lg:my-10">
                <h1 className="font-inter text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Everything you love, from sellers you can{" "}
                  <span className="text-[#6C3BFF]">trust</span>.
                </h1>
              </div>

              {/* Description */}
              <div className="my-5 max-w-xl">
                <p className="font-inter text-sm leading-6 text-[#6B7280] sm:text-base">
                  One marketplace for millions of products across electronics,
                  fashion, home and more — curated from the world's best
                  independent vendors.
                </p>
              </div>

              {/* Buttons */}
              <div className="my-6 flex flex-wrap gap-3 sm:my-7 sm:gap-5">
                <Link
                  to="/start"
                  className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  Start Shopping&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff]"
                >
                  <span>Become a seller</span>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-regular fa-truck text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Free shipping over $50
                </p>

                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-solid fa-shield text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Buyer protection
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="banner-rs h-[250px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] lg:w-1/2">
              <img
                src={banner}
                alt="banner-img"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col-reverse gap-8 px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-15">

            {/* LEFT CONTENT */}
            <div className="banner-ls w-full lg:w-1/2">

              {/* Badge */}
              <div className="sub-title flex w-fit rounded-2xl bg-[#F0EBFF] px-3 py-1">
                <p className="font-inter text-xs font-bold text-[#6C5CFF]">
                  <i className="fa-solid fa-star"></i>
                  &nbsp;&nbsp;Over 12M shoppers · 40k+ vendors
                </p>
              </div>

              {/* Heading */}
              <div className="my-6 sm:my-8 lg:my-10">
                <h1 className="font-inter text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Everything you love, from sellers you can{" "}
                  <span className="text-[#6C3BFF]">trust</span>.
                </h1>
              </div>

              {/* Description */}
              <div className="my-5 max-w-xl">
                <p className="font-inter text-sm leading-6 text-[#6B7280] sm:text-base">
                  One marketplace for millions of products across electronics,
                  fashion, home and more — curated from the world's best
                  independent vendors.
                </p>
              </div>

              {/* Buttons */}
              <div className="my-6 flex flex-wrap gap-3 sm:my-7 sm:gap-5">
                <Link
                  to="/start"
                  className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  Start Shopping&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff]"
                >
                  <span>Become a seller</span>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-regular fa-truck text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Free shipping over $50
                </p>

                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-solid fa-shield text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Buyer protection
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="banner-rs h-[250px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] lg:w-1/2">
              <img
                src={banner}
                alt="banner-img"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col-reverse gap-8 px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-15">

            {/* LEFT CONTENT */}
            <div className="banner-ls w-full lg:w-1/2">

              {/* Badge */}
              <div className="sub-title flex w-fit rounded-2xl bg-[#F0EBFF] px-3 py-1">
                <p className="font-inter text-xs font-bold text-[#6C5CFF]">
                  <i className="fa-solid fa-star"></i>
                  &nbsp;&nbsp;Over 12M shoppers · 40k+ vendors
                </p>
              </div>

              {/* Heading */}
              <div className="my-6 sm:my-8 lg:my-10">
                <h1 className="font-inter text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Everything you love, from sellers you can{" "}
                  <span className="text-[#6C3BFF]">trust</span>.
                </h1>
              </div>

              {/* Description */}
              <div className="my-5 max-w-xl">
                <p className="font-inter text-sm leading-6 text-[#6B7280] sm:text-base">
                  One marketplace for millions of products across electronics,
                  fashion, home and more — curated from the world's best
                  independent vendors.
                </p>
              </div>

              {/* Buttons */}
              <div className="my-6 flex flex-wrap gap-3 sm:my-7 sm:gap-5">
                <Link
                  to="/start"
                  className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  Start Shopping&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff]"
                >
                  <span>Become a seller</span>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-regular fa-truck text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Free shipping over $50
                </p>

                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-solid fa-shield text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Buyer protection
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="banner-rs h-[250px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] lg:w-1/2">
              <img
                src={banner}
                alt="banner-img"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col-reverse gap-8 px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-15">

            {/* LEFT CONTENT */}
            <div className="banner-ls w-full lg:w-1/2">

              {/* Badge */}
              <div className="sub-title flex w-fit rounded-2xl bg-[#F0EBFF] px-3 py-1">
                <p className="font-inter text-xs font-bold text-[#6C5CFF]">
                  <i className="fa-solid fa-star"></i>
                  &nbsp;&nbsp;Over 12M shoppers · 40k+ vendors
                </p>
              </div>

              {/* Heading */}
              <div className="my-6 sm:my-8 lg:my-10">
                <h1 className="font-inter text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Everything you love, from sellers you can{" "}
                  <span className="text-[#6C3BFF]">trust</span>.
                </h1>
              </div>

              {/* Description */}
              <div className="my-5 max-w-xl">
                <p className="font-inter text-sm leading-6 text-[#6B7280] sm:text-base">
                  One marketplace for millions of products across electronics,
                  fashion, home and more — curated from the world's best
                  independent vendors.
                </p>
              </div>

              {/* Buttons */}
              <div className="my-6 flex flex-wrap gap-3 sm:my-7 sm:gap-5">
                <Link
                  to="/start"
                  className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  Start Shopping&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff]"
                >
                  <span>Become a seller</span>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-regular fa-truck text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Free shipping over $50
                </p>

                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-solid fa-shield text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Buyer protection
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="banner-rs h-[250px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] lg:w-1/2">
              <img
                src={banner}
                alt="banner-img"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col-reverse gap-8 px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-15">

            {/* LEFT CONTENT */}
            <div className="banner-ls w-full lg:w-1/2">

              {/* Badge */}
              <div className="sub-title flex w-fit rounded-2xl bg-[#F0EBFF] px-3 py-1">
                <p className="font-inter text-xs font-bold text-[#6C5CFF]">
                  <i className="fa-solid fa-star"></i>
                  &nbsp;&nbsp;Over 12M shoppers · 40k+ vendors
                </p>
              </div>

              {/* Heading */}
              <div className="my-6 sm:my-8 lg:my-10">
                <h1 className="font-inter text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Everything you love, from sellers you can{" "}
                  <span className="text-[#6C3BFF]">trust</span>.
                </h1>
              </div>

              {/* Description */}
              <div className="my-5 max-w-xl">
                <p className="font-inter text-sm leading-6 text-[#6B7280] sm:text-base">
                  One marketplace for millions of products across electronics,
                  fashion, home and more — curated from the world's best
                  independent vendors.
                </p>
              </div>

              {/* Buttons */}
              <div className="my-6 flex flex-wrap gap-3 sm:my-7 sm:gap-5">
                <Link
                  to="/start"
                  className="rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  Start Shopping&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:border-[#6c3bff] hover:text-[#6c3bff]"
                >
                  <span>Become a seller</span>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-regular fa-truck text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Free shipping over $50
                </p>

                <p className="font-inter text-xs text-[#6B7280] sm:text-sm">
                  <i className="fa-solid fa-shield text-[#37C7BB]"></i>
                  &nbsp;&nbsp;Buyer protection
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="banner-rs h-[250px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] lg:w-1/2">
              <img
                src={banner}
                alt="banner-img"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}