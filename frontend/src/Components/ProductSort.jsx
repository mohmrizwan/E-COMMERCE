import React from "react";

const ProductSort = ({ value, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-[#6b7280]">
    <span className="hidden sm:inline">Sort by</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-[#dde3f0] bg-white px-3 py-2 text-sm font-semibold text-black outline-none focus:border-[#6c3bff]">
      <option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest</option><option value="rating">Rating</option>
    </select>
  </label>
);

export default ProductSort;
