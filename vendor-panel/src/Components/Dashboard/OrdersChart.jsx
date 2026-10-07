import { useEffect, useState } from "react";
import { CChartBar } from "@coreui/react-chartjs";
import axios from "axios";
const API_URL ="https://ecommerceba-6dtt.onrender.com";

const OrdersChart = () => {
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  useEffect(() => {
    const getOrdersByStatus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/dashboard/order-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
            },
          },
        );
        setOrdersByStatus(response.data.ordersByStatus || []);
      } catch (error) {
        console.error(
          "Could not load dashboard order status:",
          error.response?.data?.message || error.message,
        );
      }
    };

    getOrdersByStatus();
  }, []);

  const data = {
    labels: ordersByStatus.map((item) => item.status),
    datasets: [
      {
        label: "Orders",
        data: ordersByStatus.map((item) => item.orders),
      },
    ],
  };

  return (
    <CChartBar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
      style={{ height: "300px" }}
    />
  );
};

export default OrdersChart;