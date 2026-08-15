import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Banner from "../Components/Banner";
import Category from "../Components/Category";
import Features from "../Components/Features";
import Product from "../Components/Product";

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <Category />
      <Features />
      <Product />
      <Footer />
    </>
  );
};

export default Home;
