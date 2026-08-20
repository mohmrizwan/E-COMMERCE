import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddToCart from "./Pages/Addtocart";
import Products from "./Pages/Products";
import Checkout from "./Pages/Checkout";


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/checkout" element={<Checkout />} />
  
      </Routes>
    </>
  );
};

export default App;
