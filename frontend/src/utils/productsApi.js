import axios from "axios";

const API_ORIGIN =
  import.meta.env.VITE_API_URL || "https://ecommerceba-6dtt.onrender.com";

export const getProductsForCurrentStorefront = async () => {
  try {
    return await axios.get(`${API_ORIGIN}/storefront/products`);
  } catch (error) {
    // The root marketplace domain has no vendor mapping and keeps its shared catalog.
    if (error.response?.status !== 404) throw error;
    return axios.get(`${API_ORIGIN}/products/allProducts`);
  }
};
