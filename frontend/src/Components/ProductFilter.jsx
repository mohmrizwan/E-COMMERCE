import React from "react";

const FilterSection = ({ title, children }) => <section className="border-b border-[#edf0f5] py-5 first:pt-0 last:border-0"><h3 className="mb-3 text-sm font-bold">{title}</h3>{children}</section>;
const CheckOption = ({ label, checked, onChange }) => <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-[#4b5563]"><input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#173D35]" />{label}</label>;

const ProductFilter = ({ filters, onChange, onClear, categories = [] }) => (
  <aside className="rounded-[20px] border border-[#dde3f0] bg-white p-5">
    <div className="mb-1 flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2><button type="button" onClick={onClear} className="text-xs font-semibold text-[#173D35] hover:text-[#0f2a24]">Clear all</button></div>
    <FilterSection title="Category"><div className="space-y-1"><label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm"><input type="radio" name="category" checked={!filters.category} onChange={() => onChange("category", "")} className="h-4 w-4 accent-[#173D35]" />All Categories</label>{categories.map((category) => <label key={category.value} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-[#4b5563]"><input type="radio" name="category" checked={filters.category === category.value} onChange={() => onChange("category", category.value)} className="h-4 w-4 accent-[#173D35]" />{category.label}</label>)}</div></FilterSection>
    <FilterSection title="Price Range"><div className="grid grid-cols-2 gap-2"><input type="number" min="0" value={filters.minPrice} onChange={(event) => onChange("minPrice", event.target.value)} placeholder="Min ₹" className="w-full rounded-lg border border-[#dde3f0] px-2 py-2 text-sm outline-none focus:border-[#173D35]" /><input type="number" min="0" value={filters.maxPrice} onChange={(event) => onChange("maxPrice", event.target.value)} placeholder="Max ₹" className="w-full rounded-lg border border-[#dde3f0] px-2 py-2 text-sm outline-none focus:border-[#173D35]" /></div></FilterSection>
    <FilterSection title="Availability"><CheckOption label="In Stock" checked={filters.inStock === true} onChange={() => onChange("inStock", filters.inStock === true ? null : true)} /><CheckOption label="Out of Stock" checked={filters.inStock === false} onChange={() => onChange("inStock", filters.inStock === false ? null : false)} /></FilterSection>
  </aside>
);

export default ProductFilter;
