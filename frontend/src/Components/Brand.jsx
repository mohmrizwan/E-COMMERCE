import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrandsForCurrentStorefront } from "../utils/productsApi";

const BrandsSection = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await getBrandsForCurrentStorefront();
        setBrands(Array.isArray(response.data?.brands) ? response.data.brands : []);
      } catch (error) {
        console.error("Could not load brands.", error);
      }
    };

    loadBrands();
  }, []);

  if (!brands.length) {
    return null;
  }

  return (
    <section className="w-full px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Heading */}
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#173D35] sm:text-3xl">
              Shop by Brands
            </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Explore your favourite brands.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group flex min-w-0 flex-col items-center text-center"
            >
              {/* Circular Brand Image */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    className="h-full w-full rounded-full object-contain p-3"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-400">
                    {brand.name?.charAt(0)}
                  </span>
                )}
              </div>

              {/* Brand Name */}
            
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;