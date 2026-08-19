import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-[#dde3f0] bg-white transition duration-150 hover:-translate-y-1 hover:border-[#b6a5e7] hover:shadow-lg hover:shadow-[#6c3bff]/10">
      <div className="relative overflow-hidden bg-[#f5f5f5]">
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <span className="w-fit rounded-full bg-[#6c3bff] px-3 py-1 text-[11px] font-semibold text-white">New in</span>}
          {discount > 0 && <span className="w-fit rounded-full bg-[#ffb020] px-3 py-1 text-[11px] font-semibold text-black">-{discount}%</span>}
        </div>
        <button type="button" aria-label={`Add ${product.name} to wishlist`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6b7280] shadow-sm transition hover:text-red-500">
          <i className="fa-regular fa-heart" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#6b7280]">{product.vendor} · {product.brand}</p>
        <h2 className="mt-1 min-h-10 text-sm font-bold leading-5 transition hover:text-[#6c3bff]">{product.name}</h2>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-[#ffb020]">★</span><span className="font-semibold">{product.rating}</span><span className="text-[#6b7280]">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><span className="text-base font-bold">₹{product.price.toLocaleString()}</span><span className="text-xs text-[#6b7280] line-through">₹{product.originalPrice.toLocaleString()}</span></div>
          <Link to="/cart" aria-label={`Add ${product.name} to cart`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6c3bff] text-white transition hover:bg-[#5427d6]"><i className="fa-solid fa-bag-shopping text-sm" /></Link>
        </div>
        <p className={`mt-3 text-xs ${product.inStock ? "text-green-600" : "text-red-500"}`}>{product.inStock ? "In stock · Free shipping" : "Currently out of stock"}</p>
      </div>
    </article>
  );
};

export default ProductCard;
