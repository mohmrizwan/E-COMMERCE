import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductFilter from "../Components/ProductFilter";
import ProductGrid from "../Components/ProductGrid";
import ProductSort from "../Components/ProductSort";
import { getCategoryLabel, products } from "../data/products";

const defaultFilters = { category: "", minPrice: "", maxPrice: "", brands: [], rating: 0, inStock: null, sort: "featured" };

const readFilters = (params) => ({
  category: params.get("category") || "",
  minPrice: params.get("min") || "",
  maxPrice: params.get("max") || "",
  brands: params.get("brand") ? params.get("brand").split(",") : [],
  rating: Number(params.get("rating") || 0),
  inStock: params.get("stock") === "in" ? true : params.get("stock") === "out" ? false : null,
  sort: params.get("sort") || "featured",
});

const writeFilters = (filters) => {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("min", filters.minPrice);
  if (filters.maxPrice) params.set("max", filters.maxPrice);
  if (filters.brands.length) params.set("brand", filters.brands.join(","));
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.inStock !== null) params.set("stock", filters.inStock ? "in" : "out");
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({ ...defaultFilters, ...readFilters(searchParams) }));
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters((current) => ({ ...current, ...readFilters(searchParams) }));
  }, [searchParams]);

  const brands = useMemo(() => [...new Set(products.filter((product) => !filters.category || product.category === filters.category).map((product) => product.brand))].sort(), [filters.category]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesMin = !filters.minPrice || product.price >= Number(filters.minPrice);
      const matchesMax = !filters.maxPrice || product.price <= Number(filters.maxPrice);
      const matchesBrand = !filters.brands.length || filters.brands.includes(product.brand);
      const matchesRating = !filters.rating || product.rating >= filters.rating;
      const matchesStock = filters.inStock === null || product.inStock === filters.inStock;
      return matchesCategory && matchesMin && matchesMax && matchesBrand && matchesRating && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      if (filters.sort === "newest") return Number(b.isNew) - Number(a.isNew);
      if (filters.sort === "rating") return b.rating - a.rating;
      return a.id - b.id;
    });
  }, [filters]);

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters };
    if (key === "brands") {
      nextFilters.brands = filters.brands.includes(value) ? filters.brands.filter((brand) => brand !== value) : [...filters.brands, value];
    } else {
      nextFilters[key] = value;
    }
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
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6c3bff]">Marketplace</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{getCategoryLabel(filters.category)}</h1><p className="mt-2 text-sm text-[#6b7280]">Explore trusted vendors and standout products.</p></div>
          <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="flex w-fit items-center gap-2 rounded-xl border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-semibold lg:hidden"><i className="fa-solid fa-sliders" />{filtersOpen ? "Hide filters" : "Show filters"}</button>
        </div>
        <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}><ProductFilter filters={filters} brands={brands} onChange={updateFilter} onClear={clearFilters} /></div>
          <section className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-4"><p className="text-sm text-[#6b7280]"><span className="font-bold text-black">{visibleProducts.length}</span> products found</p><ProductSort value={filters.sort} onChange={(value) => updateFilter("sort", value)} /></div>
            <ProductGrid products={visibleProducts} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
