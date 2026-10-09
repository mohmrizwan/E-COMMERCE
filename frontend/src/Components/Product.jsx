import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useCart } from "../Components/CartContext";
import FavoriteButton from "./FavoriteButton";

// https://ecommerceba-6dtt.onrender.com/products/allProducts
const Product = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
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
    } finally {
      setLoading(false);
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

        {/* ================= PRODUCT CARDS ================= */}
        <div className="product-cards my-6 grid grid-cols-2 gap-3 sm:my-8 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  key={`product-skeleton-${index}`}
                  aria-hidden="true"
                  className="flex min-w-0 animate-pulse flex-col overflow-hidden rounded-2xl border border-[#dde3f0] bg-white sm:rounded-[20px]"
                >
                  {/* Image Skeleton */}
                  <div className="h-40 w-full bg-[#E9E5FC] sm:h-60 md:h-64 lg:h-72 xl:h-80" />

                  {/* Product Details Skeleton */}
                  <div className="flex flex-1 flex-col gap-3 p-2.5 sm:p-4">
                    <div className="h-3 w-1/3 rounded bg-[#E9E5FC]" />
                    <div className="h-4 w-4/5 rounded bg-[#E9E5FC]" />
                    <div className="h-3 w-1/2 rounded bg-[#E9E5FC]" />

                    {/* Price + Cart Button Skeleton */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="h-5 w-1/3 rounded bg-[#E9E5FC]" />
                      <div className="h-8 w-8 rounded-xl bg-[#E9E5FC]" />
                    </div>

                    {/* Stock Skeleton */}
                    <div className="h-3 w-1/4 rounded bg-[#E9E5FC]" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                // Yahan tumhara existing product card JSX rahega
                <div key={product._id}>
                  {/* Existing product card ka complete content yahan rakho */}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
