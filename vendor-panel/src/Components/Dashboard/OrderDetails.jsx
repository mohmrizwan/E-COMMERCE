import React from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

const RecentOrders = () => {
  const orders = [
    {
      id: "#ORD001",
      customer: "Mohammad Rizwan",
      product: "Nike Air Max",
      amount: "₹4,999",
      status: "Delivered",
      date: "01 Sep 2026",
    },
    {
      id: "#ORD002",
      customer: "Aman Sharma",
      product: "iPhone Case",
      amount: "₹899",
      status: "Pending",
      date: "01 Sep 2026",
    },
    {
      id: "#ORD003",
      customer: "Rahul Verma",
      product: "Adidas Shoes",
      amount: "₹3,499",
      status: "Shipped",
      date: "31 Aug 2026",
    },
    {
      id: "#ORD004",
      customer: "Arjun Singh",
      product: "Smart Watch",
      amount: "₹2,999",
      status: "Processing",
      date: "31 Aug 2026",
    },
  ];

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
              <span className="fw-semibold text-primary">{order.id}</span>
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
              <span className="fw-bold">{order.amount}</span>
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
              <span className="text-body-secondary">{order.date}</span>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default RecentOrders;
