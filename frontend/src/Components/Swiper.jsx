import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { API_ORIGIN } from "../utils/productsApi";
import { useCart } from "./CartContext";
import fallbackImage from "../assets/images/banner.jpg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const fallbackBanner = {
  _id: "marketplace-banner",
  title: "Find something you’ll love",
  highlighted: "Discover products from independent sellers.",
  image: fallbackImage,
  productUrl: "/products",
  buttonText: "Start Shopping",
  vendorName: "VendoraFlame Marketplace",
};

export default function StorefrontSwiper() {
  const [banners, setBanners] = useState([]);
  const [addedProductId, setAddedProductId] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;
    axios.get(`${API_ORIGIN}/storefront/banners`)
      .then(({ data }) => {
        if (active) setBanners(Array.isArray(data.banners) ? data.banners : []);
      })
      .catch(() => {
        // Keep the existing marketplace hero visible if the banners API is unavailable.
      });
    return () => { active = false; };
  }, []);

  const slides = banners.length ? banners : [fallbackBanner];

  return (
    <Swiper
      spaceBetween={24}
      centeredSlides
      autoplay={slides.length > 1 ? { delay: 4500, disableOnInteraction: false } : false}
      pagination={{ clickable: true }}
      navigation={slides.length > 1}
      loop={slides.length > 1}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {slides.map((banner) => (
        <SwiperSlide key={banner._id}>
          <article className="flex min-h-[420px] flex-col-reverse gap-7 rounded-2xl border border-[#e4e6ec] bg-white p-5 sm:p-8 lg:min-h-[520px] lg:flex-row lg:items-center lg:gap-10 lg:px-15 lg:py-12">
            <div className="w-full lg:w-1/2">
              <p className="mb-5 inline-flex rounded-full bg-[#F0EBFF] px-3 py-1 text-xs font-bold text-[#6C5CFF]">
                {banner.vendorName || "Featured product"}
              </p>
              <h1 className="font-inter text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
                {banner.title}
              </h1>
              <p className="my-5 max-w-xl text-sm leading-6 text-[#6B7280] sm:text-base">
                <span className="font-semibold text-[#6C3BFF]">{banner.highlighted}</span>
              </p>
              {banner.cartProduct ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!banner.cartProduct.inStock) return;
                    addToCart(banner.cartProduct);
                    setAddedProductId(String(banner.cartProduct._id));
                  }}
                  disabled={!banner.cartProduct.inStock}
                  className="inline-flex items-center rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] disabled:cursor-not-allowed disabled:bg-gray-400 sm:px-6"
                >
                  {!banner.cartProduct.inStock
                    ? "Out of Stock"
                    : addedProductId === String(banner.cartProduct._id)
                      ? "Added to Cart"
                      : banner.buttonText || "Shop Now"}
                  <i className="fa-solid fa-bag-shopping ms-2" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  to={banner.productUrl}
                  className="inline-flex items-center rounded-2xl bg-[#6C3BFF] px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] sm:px-6"
                >
                  {banner.buttonText || "Start Shopping"}
                  <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" />
                </Link>
              )}
            </div>
            <div className="h-[230px] w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[320px] lg:h-[420px] lg:w-1/2">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
