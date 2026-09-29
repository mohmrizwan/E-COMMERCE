import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductFilter from "../Components/ProductFilter";
import ProductGrid from "../Components/ProductGrid";
import ProductSort from "../Components/ProductSort";
import { getCategoryLabel } from "../data/products";
import Loader from "../Components/Loader"

const defaultFilters = {
  category: "",
  minPrice: "",
  maxPrice: "",
  inStock: null,
  sort: "featured",
};

const readFilters = (params) => ({
  category: params.get("category") || "",
  minPrice: params.get("min") || "",
  maxPrice: params.get("max") || "",
  inStock:
    params.get("stock") === "in"
      ? true
      : params.get("stock") === "out"
        ? false
        : null,
  sort: params.get("sort") || "featured",
});

const writeFilters = (filters) => {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("min", filters.minPrice);
  if (filters.maxPrice) params.set("max", filters.maxPrice);
  if (filters.inStock !== null)
    params.set("stock", filters.inStock ? "in" : "out");
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    ...readFilters(searchParams),
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const response = await axios.get(
          "https://ecommerceba-6dtt.onrender.com/products/allProducts",
        );
        setProducts(
          Array.isArray(response.data.products) ? response.data.products : [],
        );
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load products.",
        );
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    setFilters((current) => ({ ...current, ...readFilters(searchParams) }));
  }, [searchParams]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesMin =
        !filters.minPrice || Number(product.price) >= Number(filters.minPrice);
      const matchesMax =
        !filters.maxPrice || Number(product.price) <= Number(filters.maxPrice);
      const matchesStock =
        filters.inStock === null || product.inStock === filters.inStock;
      return matchesCategory && matchesMin && matchesMax && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === "price-asc")
        return Number(a.price) - Number(b.price);
      if (filters.sort === "price-desc")
        return Number(b.price) - Number(a.price);
      if (filters.sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [filters, products]);

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters };
    nextFilters[key] = value;
    setFilters(nextFilters);
    setSearchParams(writeFilters(nextFilters));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-375 px-4 py-8 sm:px-6 md:px-10 lg:px-15">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6c3bff]">
              Marketplace
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {getCategoryLabel(filters.category)}
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Explore trusted vendors and standout products.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex w-fit items-center gap-2 rounded-xl border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-semibold lg:hidden"
          >
            <i className="fa-solid fa-sliders" />
            {filtersOpen ? "Hide filters" : "Show filters"}
          </button>
        </div>
        <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
            <ProductFilter
              filters={filters}
              onChange={updateFilter}
              onClear={clearFilters}
            />
          </div>
          <section className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-[#6b7280]">
                <span className="font-bold text-black">
                  {visibleProducts.length}
                </span>{" "}
                products found
              </p>
              <ProductSort
                value={filters.sort}
                onChange={(value) => updateFilter("sort", value)}
              />
            </div>
            {loading ? (
              <p className="text-sm text-[#6b7280]">
                <Loader />
              </p>
            ) : errorMessage ? (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            ) : (
              <ProductGrid products={visibleProducts} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
