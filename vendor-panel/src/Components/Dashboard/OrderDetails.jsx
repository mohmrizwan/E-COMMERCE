import { useEffect, useState } from "react";
import axios from "axios";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

const API_URL ="https://ecommerceba-6dtt.onrender.com";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getRecentOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/dashboard/recent-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
            },
          },
        );
        setOrders(response.data.recentOrders || []);
      } catch (error) {
        console.error(
          "Could not load recent orders:",
          error.response?.data?.message || error.message,
        );
      }
    };

    getRecentOrders();
  }, []);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Pending":
        return "warning";
      case "Shipped":
        return "info";
      case "Processing":
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <CTable hover responsive align="middle" className="mb-0">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell className="text-body-secondary">
            Order ID
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Customer
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Product
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Amount
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Status
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Date
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {orders.map((order) => (
          <CTableRow key={order.id}>
            {/* Order ID */}
            <CTableDataCell>
              <span className="fw-semibold text-primary">#{order.id.slice(-6).toUpperCase()}</span>
            </CTableDataCell>

            {/* Customer */}
            <CTableDataCell>
              <div className="fw-semibold">{order.customer}</div>
              <small className="text-body-secondary">Customer</small>
            </CTableDataCell>

            {/* Product */}
            <CTableDataCell>{order.product}</CTableDataCell>

            {/* Amount */}
            <CTableDataCell>
              <span className="fw-bold">{formatAmount(order.amount)}</span>
            </CTableDataCell>

            {/* Status */}
            <CTableDataCell>
              <CBadge
                color={getStatusColor(order.status)}
                shape="rounded-pill"
                className="px-3 py-2"
              >
                {order.status}
              </CBadge>
            </CTableDataCell>

            {/* Date */}
            <CTableDataCell>
              <span className="text-body-secondary">{formatDate(order.date)}</span>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default RecentOrders;
