import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
// https://ecommerceba-6dtt.onrender.com/products/allProducts
const Product = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const getProducts = async () => {
    try {
      const respone = await axios.get(
        "https://ecommerceba-6dtt.onrender.com/products/allProducts",
      );

      setProducts(
        Array.isArray(respone.data.products)
          ? respone.data.products.slice(0, 4)
          : [],
      );
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="product-wrapper my-8 sm:my-12 md:my-15">
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className="mx-auto w-full px-3 sm:px-6 md:px-10 lg:px-15">
        {/* ================= PRODUCT CARDS ================= */}
        <div className="product-cards my-6 grid grid-cols-2 gap-3 sm:my-8 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#dde3f0] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#b6a5e7] hover:shadow-lg sm:rounded-[20px]"
            >
              {/* ================= PRODUCT IMAGE ================= */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-60 md:h-64 lg:h-72 xl:h-80"
                />

                {/* Badges */}
                <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-2">
                  <span className="rounded-full bg-[#6C3BFF] px-2 py-1 font-[inter] text-[8px] font-semibold text-white sm:px-3 sm:text-xs">
                    {product.status}
                  </span>

                  {Number(product.discount) > 0 && (
                    <span className="rounded-full bg-[#FFB020] px-2 py-1 font-[inter] text-[8px] font-semibold text-black sm:px-3 sm:text-xs">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition duration-200 hover:bg-[#6C3BFF] hover:text-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                >
                  <i className="fa-regular fa-heart text-[11px] sm:text-sm"></i>
                </button>
              </div>

              {/* ================= PRODUCT CONTENT ================= */}
              <div className="flex flex-1 flex-col p-2.5 sm:p-3 md:p-4">
                {/* Store */}
                <span className="font-[inter] text-[9px] text-[#6B7280] sm:text-xs">
                  {product.store || "Store"}
                </span>

                {/* Product Name */}
                <h4 className="mt-1 line-clamp-2 min-h-[30px] font-[inter] text-[11px] font-bold leading-4 text-[#111827] transition duration-200 group-hover:text-[#6C3BFF] sm:min-h-[40px] sm:text-sm sm:leading-5">
                  {product.name}
                </h4>

                <div className="mt-1.5 text-[9px] text-[#6B7280] sm:mt-2 sm:text-xs">
                  No reviews yet
                </div>

                {/* Price + Cart */}
                <div className="mt-3 flex items-center justify-between gap-1 sm:mt-5">
                  <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <span className="font-[inter] text-xs font-bold text-[#111827] sm:text-sm md:text-base">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </span>

                    {product.oldPrice != null && (
                      <span className="truncate font-[inter] text-[8px] text-[#6B7280] line-through sm:text-xs">
                        ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <Link
                    to="/cart"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6C3BFF] text-white transition duration-200 hover:bg-[#421db3] sm:h-9 sm:w-9 sm:rounded-xl"
                  >
                    <i className="fa-solid fa-bag-shopping text-[10px] sm:text-sm"></i>
                  </Link>
                </div>

                {/* Shipping */}
                <p
                  className={`mt-2 font-[inter] text-[9px] font-medium sm:mt-3 sm:text-xs ${product.inStock ? "text-green-600" : "text-red-500"}`}
                >
                  {product.inStock ? "In stock" : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
