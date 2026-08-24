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

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <Category />
      <Features />
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
