import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddToCart from "./Pages/Addtocart";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<AddToCart />} />
      </Routes>
    </>
  );
};

export default App;
