import React from "react";
import Swiper from "./Swiper";

const Banner = () => {
  return (
    <div className="banner-wrapper">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="m-2 overflow-hidden rounded-xl bg-white sm:m-3 sm:rounded-2xl md:m-4 lg:m-5">
          <Swiper />
        </div>
      </div>
    </div>
  );
};

export default Banner;