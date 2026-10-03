import useFavorites from "./useFavorites";

const FavoriteButton = ({ product, className = "" }) => {
  const { isFavorite, isLoading, pendingIds, toggleFavorite } = useFavorites();
  const productId = String(product?._id || "");
  const saved = isFavorite(productId);
  const isPending = pendingIds.includes(productId);

  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={saved}
      title={saved ? "Remove from wishlist" : "Add to wishlist"}
      disabled={!productId || isLoading || isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleFavorite(product);
      }}
      className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6b7280] shadow-sm transition hover:text-red-500 disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${className}`}
    >
      {isPending ? (
        <i className="fa-solid fa-spinner animate-spin text-xs" aria-hidden="true" />
      ) : (
        <i
          className={`${saved ? "fa-solid text-red-500" : "fa-regular"} fa-heart text-sm`}
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default FavoriteButton;