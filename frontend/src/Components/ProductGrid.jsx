import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!products.length) return <div className="rounded-[20px] border border-dashed border-[#cbd3e1] bg-white p-10 text-center"><p className="text-lg font-bold">No products match these filters</p><p className="mt-2 text-sm text-[#6b7280]">Try widening your price range or clearing a filter.</p></div>;
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
};

export default ProductGrid;
