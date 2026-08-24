import React from "react";

const Loader = () => {
  return (
    <div class="flex flex-col bg-neutral-300 w-56 h-64 animate-pulse rounded-xl p-4 gap-4">
      <div class="bg-neutral-400/50 w-full h-32 animate-pulse rounded-md"></div>
      <div class="flex flex-col gap-2">
        <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div class="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
        <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div class="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
};

export default Loader;

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getProducts = async () => {
//       try {
//         const res = await axios.get("/api/products");

//         setProducts(res.data);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getProducts();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

//       {loading ? (
//         /* Skeleton */
//         Array.from({ length: 4 }).map((_, index) => (
//           <div
//             key={index}
//             className="flex h-64 w-full animate-pulse flex-col gap-4 rounded-xl bg-[#F7F5FF] p-4"
//           >
//             {/* Image */}
//             <div className="h-32 w-full rounded-md bg-[#E9E3FF]" />

//             {/* Content */}
//             <div className="flex flex-col gap-2">
//               <div className="h-4 w-full rounded-md bg-[#DDD4FF]" />
//               <div className="h-4 w-4/5 rounded-md bg-[#E9E3FF]" />
//               <div className="h-4 w-full rounded-md bg-[#DDD4FF]" />
//               <div className="h-4 w-2/4 rounded-md bg-[#E9E3FF]" />
//             </div>
//           </div>
//         ))
//       ) : (
//         /* Actual Data */
//         products.map((product) => (
//           <div
//             key={product._id}
//             className="rounded-xl bg-white p-4"
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               className="h-32 w-full rounded-md object-cover"
//             />

//             <h2 className="mt-3 font-semibold">
//               {product.name}
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               {product.description}
//             </p>
//           </div>
//         ))
//       )}

//     </div>
//   );
// };
