import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import useFavorites from "../Components/useFavorites";

const FavoriteCard = () => {
  const {
    products,
    isLoading,
    errorMessage,
    loadFavorites,
    pendingIds,
    removeFavorite,
  } = useFavorites();

  return (
    <>
      <Header />
      <div className="cart-wrapper my-5">
        <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-15">
          {/* Cart Heading */}
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
              className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={`wishlist-skeleton-${index}`}
                  aria-hidden="true"
                  className="animate-pulse overflow-hidden rounded-2xl border border-[#dde3f0] bg-white"
                >
                  <div className="h-40 bg-[#E9E5FC] sm:h-60 md:h-64 lg:h-72" />
                  <div className="space-y-3 p-3 sm:p-4">
                    <div className="h-3 w-1/3 rounded bg-[#E9E5FC]" />
                    <div className="h-4 w-4/5 rounded bg-[#E9E5FC]" />
                    <div className="h-4 w-1/2 rounded bg-[#E9E5FC]" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="my-12 text-center">
              <p className="text-lg font-semibold text-[#111827]">Your wishlist is empty</p>
              <p className="mt-2 text-sm text-[#6B7280]">Products you save will appear here.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white">
                Explore products
              </Link>
            </div>
          ) : (
          <div className="product-cards my-6 grid grid-cols-2 gap-3 sm:my-8 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="product-card group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#dde3f0] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#b6a5e7] hover:shadow-lg sm:rounded-[20px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name || "Wishlist product"}
                    className="h-40 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-60 md:h-64 lg:h-72 xl:h-80"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from wishlist`}
                    disabled={pendingIds.includes(String(product._id))}
                    onClick={() => removeFavorite(product._id)}
                    className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition duration-200 hover:bg-[#6C3BFF] hover:text-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                  >
                    {pendingIds.includes(String(product._id)) ? (
                      <i className="fa-solid fa-spinner animate-spin text-[11px] sm:text-sm" />
                    ) : (
                      <i className="fa-solid fa-heart-crack text-[11px] sm:text-sm"></i>
                    )}
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-2.5 sm:p-3 md:p-4">
                  <span className="font-[inter] text-[9px] text-[#6B7280] sm:text-xs">
                    {product.category || "Product"}
                  </span>
                  <h4 className="mt-1 line-clamp-2 min-h-7.5 font-[inter] text-[11px] font-bold leading-4 text-[#111827] transition duration-200 group-hover:text-[#6C3BFF] sm:min-h-10 sm:text-sm sm:leading-5">
                    {product.name || "Unnamed product"}
                  </h4>
                  <div className="mt-3 flex items-center justify-between gap-1 sm:mt-5">
                    <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                      <span className="font-[inter] text-xs font-bold text-[#111827] sm:text-sm md:text-base">
                        ₹{Number(product.pricing ?? product.price ?? 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      to="/cart"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6C3BFF] text-white transition duration-200 hover:bg-[#421db3] sm:h-9 sm:w-9 sm:rounded-xl"
                    >
                      <i className="fa-solid fa-bag-shopping text-[10px] sm:text-sm"></i>
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavoriteCard;
