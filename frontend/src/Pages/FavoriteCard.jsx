import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import useFavorites from "../Components/useFavorites";
import ProductGrid from "../Components/ProductGrid";

const FavoriteCard = () => {
  const {
    products,
    isLoading,
    errorMessage,
    loadFavorites,
    removeFavorite,
  } = useFavorites();

  // Favorites are populated from the raw Product model, while the Products
  // endpoint exposes these derived fields to ProductCard.
  const cardProducts = products.filter(Boolean).map((product) => {
    const pricing = Number(product.pricing ?? product.oldPrice ?? product.price ?? 0);
    const discount = Number(product.discount) || 0;

    return {
      ...product,
      discount,
      price: Number(
        product.price ??
          (discount > 0 ? Math.round(pricing * (1 - discount / 100)) : pricing),
      ),
      oldPrice:
        product.oldPrice !== undefined
          ? product.oldPrice
          : discount > 0
            ? pricing
            : null,
      store: product.store || product.vendorId?.businessName || "Store",
      inStock:
        typeof product.inStock === "boolean"
          ? product.inStock
          : Number(product.stockQuantity) > 0,
    };
  });

  return (
    <>
      <Header />
      <div className="cart-wrapper my-5">
        <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
          <div className="cart-head flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <h3 className="font-[inter] text-2xl font-bold text-black sm:text-3xl">
                Your Wishlist
              </h3>
              <p className="my-2 font-[inter] text-xs text-[#6B7280] sm:text-sm">
                {products.length} {products.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {errorMessage && (
            <div role="alert" className="my-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span>{errorMessage}</span>
              <button type="button" onClick={loadFavorites} className="font-semibold underline">
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div
              aria-label="Loading wishlist"
              aria-live="polite"
              className="my-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={`wishlist-skeleton-${index}`}
                  aria-hidden="true"
                  className="flex animate-pulse flex-col overflow-hidden rounded-[20px] border border-[#dde3f0] bg-white"
                >
                  <div className="h-56 w-full bg-[#e8f0ee] sm:h-64" />
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="h-3 w-1/3 rounded bg-[#e8f0ee]" />
                    <div className="h-4 w-4/5 rounded bg-[#e8f0ee]" />
                    <div className="h-3 w-1/2 rounded bg-[#e8f0ee]" />
                    <div className="mt-2 h-5 w-2/5 rounded bg-[#e8f0ee]" />
                    <div className="mt-1 h-9 w-full rounded-lg bg-[#e8f0ee]" />
                  </div>
                </div>
              ))}
            </div>
          ) : cardProducts.length === 0 ? (
            <div className="my-12 text-center">
              <p className="text-lg font-semibold text-[#111827]">Your wishlist is empty</p>
              <p className="mt-2 text-sm text-[#6B7280]">Products you save will appear here.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold !text-white">
                Explore products
              </Link>
            </div>
          ) : (
            <div className="my-6 sm:my-8">
              <ProductGrid
                products={cardProducts}
                onRemoveFavorite={removeFavorite}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavoriteCard;
