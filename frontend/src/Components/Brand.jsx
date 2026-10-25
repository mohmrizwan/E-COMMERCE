
const brands = [
  { id: 1, name: "Brand One", logo: "/brands/brand1.png" },
  { id: 2, name: "Brand Two", logo: "/brands/brand2.png" },
  { id: 3, name: "Brand Three", logo: "/brands/brand3.png" },
  { id: 4, name: "Brand Four", logo: "/brands/brand4.png" },
  { id: 5, name: "Brand Five", logo: "/brands/brand5.png" },
  { id: 6, name: "Brand Six", logo: "/brands/brand6.png" },
  { id: 7, name: "Brand Seven", logo: "/brands/brand7.png" },
  { id: 8, name: "Brand Eight", logo: "/brands/brand8.png" },
];

const BrandsSection = () => {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-screen-2xl">

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Shop by Brands
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Explore your favourite brands.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">

          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className="group flex min-w-0 flex-col items-center text-center"
            >
              {/* Circular Brand Image */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28 lg:h-32 lg:w-32">

                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                  className="h-full w-full rounded-full object-contain p-3"
                />

              </div>

              {/* Brand Name */}
              <span className="mt-3 max-w-full truncate text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-violet-600 sm:text-base">
                {brand.name}
              </span>
            </button>
          ))}

        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
