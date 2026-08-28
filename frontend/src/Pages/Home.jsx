import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Banner from "../Components/Banner";
import Category from "../Components/Category";
import Features from "../Components/Features";
import Product from "../Components/Product";
import Sesssion from "../Components/Sesssion";
import Trending from "../Components/Trending";
import Vendors from "../Components/Vendors";
import Subscribe from "../Components/Subscribe";
import Loader from "../Components/Loader";
import Dotter from "../Components/Dotter";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <Category />
      <Features />
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
        </div>
      </div>
      <Product />
      <Sesssion />
      <Trending />
      <Vendors />
      <Subscribe />
      <Footer />
    </>
  );
};

export default Home;
