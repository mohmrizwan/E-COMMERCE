import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useCart } from "../Components/CartContext";
import { API_ORIGIN } from "../utils/productsApi";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(`${API_ORIGIN}/products/${id}`)
      .then(({ data }) => { if (active) { setProduct(data.product); setSelectedImage(data.product?.images?.[0] || data.product?.image || ""); } })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load this product."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-16">Loading product…</main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-red-600">{error || "Product not found."}</p>
          <Link to="/products" className="mt-4 inline-block font-semibold text-violet-700">Browse products</Link>
        </main>
        <Footer />
      </>
    );
  }

  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const price = Number(product.price || 0);
  const oldPrice = product.oldPrice != null ? Number(product.oldPrice) : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-violet-700">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-violet-700">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img src={selectedImage || images[0] || product.image} alt={product.name} className="h-96 w-full object-contain bg-slate-50" />
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 border-t border-slate-200 p-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button key={index} type="button" onClick={() => setSelectedImage(image)} className={`overflow-hidden rounded-xl border-2 ${selectedImage === image ? "border-violet-700" : "border-slate-200"}`}>
                    <img src={image} alt={`${product.name} ${index + 1}`} className="h-20 w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              {product.brand && <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{product.brand}</span>}
              {product.category && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{product.category}</span>}
              {product.status && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{product.status}</span>}
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-slate-500">{product.store}</p>
            <p className="mt-5 text-slate-600 leading-7">{product.description}</p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">₹{price.toLocaleString("en-IN")}</span>
              {oldPrice != null && <span className="text-lg text-slate-400 line-through">₹{oldPrice.toLocaleString("en-IN")}</span>}
            </div>

            <p className={`mt-3 text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
              {product.inStock ? "In stock" : "Out of stock"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-2 text-lg font-bold text-slate-600">-</button>
                <span className="min-w-10 text-center font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="px-4 py-2 text-lg font-bold text-slate-600">+</button>
              </div>
              <button
                type="button"
                onClick={() => addToCart({ ...product, quantity })}
                disabled={!product.inStock}
                className="rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Add to cart
              </button>
            </div>

            <Link to="/products" className="mt-8 inline-flex items-center gap-2 font-semibold text-violet-700 hover:underline">
              <i className="fa-solid fa-arrow-left" />
              Browse more products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}