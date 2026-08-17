import React from "react";
import { Link } from "react-router-dom";

const Sesssion = () => {
  return (
    <div className="session-wrapper">
      <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-15">
        <div className="cards flex flex-col gap-5 md:flex-row md:justify-between">

          {/* Electronics Card */}
          <div className="electronics w-full rounded-2xl bg-[#6C3BFF] p-6 sm:p-7 md:w-[48%]">
            <p className="font-[inter] text-sm font-semibold text-[#D5C8FF]">
              New Sessions
            </p>

            <h2 className="my-2 font-[inter] text-2xl font-bold text-white sm:text-3xl">
              Tech that keeps up with you
            </h2>

            <p className="w-full font-[inter] text-sm font-semibold leading-6 text-[#D5C8FF] sm:w-[85%] md:w-[75%]">
              Audio, wearables and cameras from top-rated vendors — now with
              extended warranty.
            </p>

            <div className="mt-5">
              <Link
                to="/start"
                className="inline-flex items-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-[#6C3BFF] transition-all duration-300 hover:translate-x-1 sm:px-6"
              >
                Shop Electronics
                <i className="fa-solid fa-arrow-right ml-3"></i>
              </Link>
            </div>
          </div>

          {/* Home Card */}
          <div className="electronics w-full rounded-2xl bg-[#00B8A9] p-6 sm:p-7 md:w-[48%]">
            <p className="font-[inter] text-sm font-semibold text-[#D5C8FF]">
              Refresh your space
            </p>

            <h2 className="my-2 font-[inter] text-2xl font-bold text-white sm:text-3xl">
              Home essentials, beautifully made
            </h2>

            <p className="w-full font-[inter] text-sm font-semibold leading-6 text-[#D5C8FF] sm:w-[85%] md:w-[75%]">
              Lighting, decor and everyday goods from independent makers
              you'll love.
            </p>

            <div className="mt-5">
              <Link
                to="/start"
                className="inline-flex items-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-[#00B8A9] transition-all duration-300 hover:translate-x-1 sm:px-6"
              >
                Shop Home
                <i className="fa-solid fa-arrow-right ml-3"></i>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sesssion;