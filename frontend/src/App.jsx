import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddToCart from "./Pages/Addtocart";
import Products from "./Pages/Products";
import Checkout from "./Pages/Checkout";
import Login from "./Components/Login";
import CreateAccount from "./Components/CreateAccount";
import FavoriteCard from "./Pages/FavoriteCard";
import Account from "./Pages/Account";
import TermsAndConditions from "./Pages/Terms&Condition";
import ContactUs from "./Pages/ContactUs";
import MyOrders from "./Pages/MyOrders";
import Verify from "./Pages/Verify";
import ProtectedRoute from "./Components/ProtectedRoutes";
import ForgotPassword from "./Components/ForgotPassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/otpVerfiy" element={<Verify />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<AddToCart />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favorite" element={<FavoriteCard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/track-order" element={<MyOrders />} />
          <Route path="/term&condition" element={<TermsAndConditions />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
