import axios from "axios";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "https://ecommerceba-6dtt.onrender.com").trim();

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL must be configured for this storefront.");
}

export const API_ORIGIN = configuredApiUrl.replace(/\/+$/, "");

export const getProductsForCurrentStorefront = async () => {
  return axios.get(`${API_ORIGIN}/storefront/products`);
};
