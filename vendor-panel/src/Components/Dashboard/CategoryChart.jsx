import { useEffect, useState } from "react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import axios from "axios";
import { apiUrl } from "../../config/api.js";


const CategoryChart = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getProductCategories = async () => {
      try {
        const response = await axios.get(
          apiUrl("dashboard/categories"),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
            },
          },
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(
          "Could not load product categories:",
          error.response?.data?.message || error.message,
        );
      }
    };

    getProductCategories();
  }, []);

  const data = {
    labels: categories.map((item) => item.category),
    datasets: [
      {
        data: categories.map((item) => item.products),
      },
    ],
  };

  return (
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
      }}
      style={{ height: "300px" }}
    />
  );
};

export default CategoryChart;
