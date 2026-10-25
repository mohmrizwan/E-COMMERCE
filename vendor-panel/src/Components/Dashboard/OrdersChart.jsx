import { useEffect, useRef, useState } from "react";
import { CChartBar } from "@coreui/react-chartjs";
import axios from "axios";
import { apiUrl } from "../../config/api.js";

const OrdersChart = () => {
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const statusRef = useRef([]);

  useEffect(() => {
    const getOrdersByStatus = async () => {
      try {
        const response = await axios.get(apiUrl("dashboard/order-status"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        });
        const list = response.data.ordersByStatus || [];
        setOrdersByStatus(list);
        statusRef.current = list;
      } catch (error) {
        console.error(
          "Could not load dashboard order status:",
          error.response?.data?.message || error.message,
        );
      }
    };

    getOrdersByStatus();
  }, []);

  useEffect(() => {
    if (!selectedStatus) {
      setOrders([]);
      return;
    }

    const getOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await axios.get(apiUrl("vendor/orders/myOrders"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        });
        const backendOrders = response.data.orders || [];
        const formattedOrders = backendOrders.map((order) => {
          const status =
            order.status === "Cancelled"
              ? "Cancelled"
              : order.vendorStatus || order.status || "Pending";
          return { ...order, displayStatus: status };
        });
        setOrders(
          formattedOrders.filter(
            (order) => order.displayStatus === selectedStatus,
          ),
        );
      } catch (error) {
        console.error("Could not load orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    getOrders();
  }, [selectedStatus]);

  const data = {
    labels: ordersByStatus.map((item) => item.status),
    datasets: [
      {
        label: "Orders",
        data: ordersByStatus.map((item) => item.orders),
        backgroundColor: "#7c3aed",
      },
    ],
  };

  return (
    <div>
      <CChartBar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onClick: (_event, elements) => {
            if (!elements.length) return;
            const index = elements[0].index;
            const status = statusRef.current[index]?.status;
            if (status) {
              setSelectedStatus(status);
            }
          },
        }}
        style={{ height: "300px" }}
      />

      {selectedStatus && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              Orders with status {selectedStatus}
            </p>
            <button
              type="button"
              className="text-sm font-bold text-slate-500 hover:text-slate-800"
              onClick={() => setSelectedStatus("")}
            >
              Close
            </button>
          </div>
          {loadingOrders ? (
            <p className="text-sm text-slate-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders found.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-600">
              {orders.map((order) => (
                <li key={order._id}>
                  {order._id} - {order.shippingAddress?.name || "Customer"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersChart;