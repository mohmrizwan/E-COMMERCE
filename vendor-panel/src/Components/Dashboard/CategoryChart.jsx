import { useEffect, useRef, useState } from "react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import axios from "axios";
import { apiUrl } from "../../config/api.js";

const CategoryChart = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const categoriesRef = useRef([]);

  useEffect(() => {
    const getProductCategories = async () => {
      try {
        const response = await axios.get(apiUrl("dashboard/categories"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        });
        const list = response.data.categories || [];
        setCategories(list);
        categoriesRef.current = list;
      } catch (error) {
        console.error(
          "Could not load product categories:",
          error.response?.data?.message || error.message,
        );
      }
    };

    getProductCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setProducts([]);
      return;
    }

    const getProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await axios.get(apiUrl("vendor/products/getAllProducts"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        });
        const allProducts = response.data.products || [];
        setProducts(
          allProducts.filter(
            (product) => product.category === selectedCategory,
          ),
        );
      } catch (error) {
        console.error("Could not load products:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    getProducts();
  }, [selectedCategory]);

  const colors = [
    "#7c3aed",
    "#2563eb",
    "#0891b2",
    "#16a34a",
    "#ca8a04",
    "#dc2626",
    "#db2777",
    "#4f46e5",
  ];

  const data = {
    labels: categories.map((item) => item.category),
    datasets: [
      {
        data: categories.map((item) => item.products),
        backgroundColor: categories.map(
          (_, index) => colors[index % colors.length],
        ),
      },
    ],
  };

  return (
    <div>
      <CChartDoughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          onClick: (_event, elements) => {
            if (!elements.length) return;
            const index = elements[0].index;
            const category = categoriesRef.current[index]?.category;
            if (category) {
              setSelectedCategory(category);
            }
          },
        }}
        style={{ height: "300px" }}
      />

      {selectedCategory && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              Products in {selectedCategory}
            </p>
            <button
              type="button"
              className="text-sm font-bold text-slate-500 hover:text-slate-800"
              onClick={() => setSelectedCategory("")}
            >
              Close
            </button>
          </div>
          {loadingProducts ? (
            <p className="text-sm text-slate-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-slate-500">No products found.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-600">
              {products.map((product) => (
                <li key={product._id}>{product.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryChart;