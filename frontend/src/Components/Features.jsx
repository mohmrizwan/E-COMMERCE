import React from "react";

const Features = () => {
  return (
    <div className="ftrs-wrapper">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-[#afb3c2] bg-[#FFFFFF] px-5 py-6 sm:grid-cols-2 sm:gap-5 sm:px-7 md:px-8 md:py-7 lg:grid-cols-4 lg:gap-6 lg:px-10">

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-solid fa-truck text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                Fast, free delivery
              </h6>
              <p className="text-xs text-[#6B7280]">
                On all orders over $50
              </p>
            </div>
          </div>

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-solid fa-reply text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                30 Days return
              </h6>
              <p className="text-xs text-[#6B7280]">
                Hassle-free refunds
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
                256-bit encryption
              </p>
            </div>
          </div>

          <div className="features flex items-center gap-3">
            <div className="w-fit shrink-0 rounded-2xl bg-[#E0F6F4] p-3">
              <i className="fa-regular fa-headphones text-[#00B8A9]"></i>
            </div>
            <div>
              <h6 className="font-[inter] text-sm font-semibold">
                24/7 Support
              </h6>
              <p className="text-xs text-[#6B7280]">
                Real humans, anytime
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;