import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_ORIGIN } from "../utils/productsApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axios.get(`${API_ORIGIN}/products/${id}`)
      .then(({ data }) => { if (active) setProduct(data.product); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load this product."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <main className="mx-auto max-w-6xl px-5 py-16">Loading product…</main>;
  if (error || !product) return <main className="mx-auto max-w-6xl px-5 py-16"><p className="text-red-600">{error || "Product not found."}</p><Link to="/products" className="font-semibold text-violet-700">Browse products</Link></main>;

  return <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2">
    <img src={product.image} alt={product.name} className="w-full rounded-2xl object-cover" />
    <section className="flex flex-col items-start justify-center">
      <p className="mb-2 text-sm text-slate-500">{product.store}</p>
      <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
      <p className="mt-4 text-slate-600">{product.description}</p>
      <p className="mt-6 text-2xl font-bold text-slate-900">₹{product.price}</p>
      {product.oldPrice && <p className="text-sm text-slate-500 line-through">₹{product.oldPrice}</p>}
      <p className="mt-3 text-sm">{product.inStock ? "In stock" : "Out of stock"}</p>
      <Link to="/products" className="mt-8 rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white">Browse more products</Link>
    </section>
  </main>;
}
