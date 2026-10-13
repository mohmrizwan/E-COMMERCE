import React from "react";

const Features = () => {
  return (
    <div className="ftrs-wrapper">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-5 py-6 sm:grid-cols-2 sm:gap-5 sm:px-7 md:px-8 md:py-7 lg:grid-cols-4 lg:gap-6 lg:px-10">

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-solid fa-truck-fast text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                Reliable Delivery
              </h6>
              <p className="text-xs text-[#6B7280]">
                Your orders, delivered with care
              </p>
            </div>
          </div>

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-solid fa-medal text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                Quality Assured
              </h6>
              <p className="text-xs text-[#6B7280]">
                Quality you can trust
              </p>
            </div>
          </div>

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-solid fa-shield text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                Secure Payment
              </h6>
              <p className="text-xs text-[#6B7280]">
                Safe and secure checkout
              </p>
            </div>
          </div>

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-solid fa-headset text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                Customer Support
              </h6>
              <p className="text-xs text-[#6B7280]">
                We're here to help
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;
