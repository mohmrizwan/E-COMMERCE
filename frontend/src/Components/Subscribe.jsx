import React from "react";
import { Link } from "react-router-dom";

const Subscribe = () => {
  return (
    <div className="subscribe-wrapper my-10">
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-15">
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">

          <h2 className="text-center font-[inter] text-2xl font-bold sm:text-3xl">
            Get $10 Off your first order
          </h2>

          <p className="my-4 w-full max-w-xl text-center font-[inter] text-sm leading-6 text-[#7C828E]">
            Join the Marqo newsletter for early access to drops, exclusive
            vendor deals and members-only discounts.
          </p>

          {/* Form */}
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">

            <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 transition-all duration-300 focus-within:border-[#6c3bff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6c3bff]/10">
              <input
                type="email"
                placeholder="You@example.com"
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>

            <Link
              to="/start"
              className="inline-flex items-center justify-center rounded-2xl bg-[#6C3BFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#5a2ee0] hover:-translate-y-0.5"
            >
              Subscribe
            </Link>

          </div>

          <p className="my-4 w-full max-w-xl text-center font-[inter] text-xs leading-5 text-[#7C828E]">
            By subscribing you agree to our Privacy Policy. Unsubscribe
            anytime.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Subscribe;