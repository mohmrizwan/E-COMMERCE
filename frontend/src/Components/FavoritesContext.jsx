import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import FavoritesContext from "./FavoritesStore";

const API_URL = "https://ecommerceba-6dtt.onrender.com";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const FavoritesProvider = () => {
  const [products, setProducts] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleUnauthorized = useCallback((error) => {
    if (error.response?.status !== 401) return false;

    localStorage.removeItem("userToken");
    navigate("/login", { replace: true });
    return true;
  }, [navigate]);

  const loadFavorites = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setIsLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(`${API_URL}/profile/favorites`, getAuthConfig());
      setProducts(Array.isArray(response.data.favorites) ? response.data.favorites : []);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setErrorMessage(getErrorMessage(error, "Could not load your wishlist."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = (productId) =>
    products.some((product) => String(product._id) === String(productId));

  const markPending = (productId, pending) => {
    setPendingIds((current) =>
      pending
        ? current.includes(productId) ? current : [...current, productId]
        : current.filter((id) => id !== productId),
    );
  };

  const toggleFavorite = async (product) => {
    const productId = String(product?._id || "");
    if (!productId || pendingIds.includes(productId)) return false;

    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login", { replace: true });
      return false;
    }

    const wasFavorite = isFavorite(productId);
    markPending(productId, true);
    setErrorMessage("");
    try {
      if (wasFavorite) {
        await axios.delete(`${API_URL}/profile/favorites/${productId}`, getAuthConfig());
      } else {
        await axios.post(`${API_URL}/profile/favorites/${productId}`, {}, getAuthConfig());
      }

      setProducts((current) =>
        wasFavorite
          ? current.filter((item) => String(item._id) !== productId)
          : current.some((item) => String(item._id) === productId)
            ? current
            : [...current, product],
      );
      return true;
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setErrorMessage(getErrorMessage(error, "Could not update your wishlist."));
      }
      return false;
    } finally {
      markPending(productId, false);
    }
  };

  const removeFavorite = async (productId) => {
    const normalizedId = String(productId || "");
    if (!normalizedId || pendingIds.includes(normalizedId)) return false;

    markPending(normalizedId, true);
    setErrorMessage("");
    try {
      await axios.delete(`${API_URL}/profile/favorites/${normalizedId}`, getAuthConfig());
      setProducts((current) =>
        current.filter((product) => String(product._id) !== normalizedId),
      );
      return true;
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setErrorMessage(getErrorMessage(error, "Could not remove this product."));
      }
      return false;
    } finally {
      markPending(normalizedId, false);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        products,
        favoriteIds: products.map((product) => String(product._id)),
        pendingIds,
        isLoading,
        errorMessage,
        clearError: () => setErrorMessage(""),
        loadFavorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {errorMessage && (
        <div
          role="alert"
          className="fixed right-4 top-20 z-100 flex max-w-sm items-center gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg"
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            aria-label="Dismiss wishlist error"
            onClick={() => setErrorMessage("")}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-red-50"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}
      <Outlet />
    </FavoritesContext.Provider>
  );
};
