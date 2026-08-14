import React from "react";
import Swiper from "./Swiper";
const Banner = () => {
  return (
    <div className="banner-wrapper">
      <div className="mx-auto px-10 ">
        <div className="bg-white m-5 rounded-2xl">
          <Swiper />
        </div>
      </div>
    </div>
  );
};

export default Banner;
