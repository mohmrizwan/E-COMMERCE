import React, { useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "#ORD-001",
      customer: "Mohammad Rizwan",
      email: "rizwan@gmail.com",
      products: "Nike Air Max",
      items: 2,
      total: "₹4,999",
      status: "Delivered",
      date: "01 Sep 2026",
      payment: "COD",
    },
    {
      id: "#ORD-002",
      customer: "Aman Sharma",
      email: "aman@gmail.com",
      products: "Smart Watch",
      items: 1,
      total: "₹2,999",
      status: "Pending",
      date: "01 Sep 2026",
      payment: "Paid",
    },
    {
      id: "#ORD-003",
      customer: "Rahul Verma",
      email: "rahul@gmail.com",
      products: "Adidas Shoes",
      items: 3,
      total: "₹5,499",
      status: "Shipped",
      date: "31 Aug 2026",
      payment: "COD",
    },
    {
      id: "#ORD-004",
      customer: "Arjun Singh",
      email: "arjun@gmail.com",
      products: "Wireless Headphones",
      items: 1,
      total: "₹1,999",
      status: "Processing",
      date: "31 Aug 2026",
      payment: "Paid",
    },
    {
      id: "#ORD-005",
      customer: "Priya Patel",
      email: "priya@gmail.com",
      products: "Leather Wallet",
      items: 2,
      total: "₹2,598",
      status: "Cancelled",
      date: "30 Aug 2026",
      payment: "Paid",
    },
  ]);

  // Status change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

    // Backend API baad mein yahan connect karenge
    console.log("Order:", orderId);
    console.log("New Status:", newStatus);
  };

  // Status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#F3E8F1",
          color: "#70207B",
        };

      case "Pending":
        return {
          backgroundColor: "#FFF4FA",
          color: "#B83E91",
        };

      case "Processing":
        return {
          backgroundColor: "#F8E9F5",
          color: "#B3398A",
        };

      case "Shipped":
        return {
          backgroundColor: "#F1E8F5",
          color: "#8B2595",
        };

      case "Cancelled":
        return {
          backgroundColor: "#F5EEF3",
          color: "#7A6A76",
        };

      default:
        return {
          backgroundColor: "#F5EEF3",
          color: "#7A6A76",
        };
    }
  };

  // Payment badge style
  const getPaymentStyle = (payment) => {
    if (payment === "Paid") {
      return {
        backgroundColor: "#F3E8F1",
        color: "#70207B",
      };
    }

    return {
      backgroundColor: "#F5EEF3",
      color: "#7A6A76",
    };
  };

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* ================= Header ================= */}
      <div className="mb-4">
        <h3
          className="fw-semibold mb-1"
          style={{ color: "#111111" }}
        >
          Orders
        </h3>

        <p
          className="mb-0"
          style={{ color: "#7A6A76" }}
        >
          Manage and track all customer orders
        </p>
      </div>

      {/* ================= Filters ================= */}
      <CCard
        className="shadow-sm mb-4"
        style={{
          backgroundColor: "#FFF4FA",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
        }}
      >
        <CCardBody>
          <CRow className="g-3">
            {/* Search */}
            <CCol md={6}>
              <div className="position-relative">
                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3"
                  style={{
                    color: "#B83E91",
                    zIndex: 2,
                  }}
                />

                <CFormInput
                  placeholder="Search by order ID or customer..."
                  className="ps-5"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6C5DE",
                    borderRadius: "8px",
                    color: "#111111",
                  }}
                />
              </div>
            </CCol>

            {/* Status Filter */}
            <CCol md={3}>
              <CFormSelect
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                  cursor: "pointer",
                }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </CFormSelect>
            </CCol>

            {/* Date Filter */}
            <CCol md={3}>
              <CFormSelect
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                  cursor: "pointer",
                }}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= Orders Table ================= */}
      <CCard
        className="shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Table Header */}
        <CCardHeader
          className="px-4 py-3"
          style={{
            backgroundColor: "#FFF4FA",
            borderBottom: "1px solid #E6C5DE",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5
                className="fw-semibold mb-1"
                style={{ color: "#111111" }}
              >
                All Orders
              </h5>

              <small style={{ color: "#7A6A76" }}>
                {orders.length} orders found
              </small>
            </div>
          </div>
        </CCardHeader>

        <CCardBody className="p-0">
          <div style={{ overflowX: "auto" }}>
            <CTable
              hover
              align="middle"
              className="mb-0"
              style={{
                minWidth: "1050px",
              }}
            >
              {/* ================= Table Head ================= */}
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    className="ps-4"
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Order ID
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Customer
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Products
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Total
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Status
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Date
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Payment
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              {/* ================= Table Body ================= */}
              <CTableBody>
                {orders.map((order) => (
                  <CTableRow key={order.id}>
                    {/* Order ID */}
                    <CTableDataCell
                      className="ps-4"
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <span
                        className="fw-semibold"
                        style={{ color: "#B83E91" }}
                      >
                        {order.id}
                      </span>
                    </CTableDataCell>

                    {/* Customer */}
                    <CTableDataCell
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <div
                        className="fw-semibold"
                        style={{ color: "#111111" }}
                      >
                        {order.customer}
                      </div>

                      <small style={{ color: "#7A6A76" }}>
                        {order.email}
                      </small>
                    </CTableDataCell>

                    {/* Products */}
                    <CTableDataCell
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <div
                        className="fw-medium"
                        style={{ color: "#111111" }}
                      >
                        {order.products}
                      </div>

                      <small style={{ color: "#7A6A76" }}>
                        {order.items} items
                      </small>
                    </CTableDataCell>

                    {/* Total */}
                    <CTableDataCell
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <span
                        className="fw-bold"
                        style={{ color: "#111111" }}
                      >
                        {order.total}
                      </span>
                    </CTableDataCell>

                    {/* Status */}
                    <CTableDataCell
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <CBadge
                          style={{
                            ...getStatusStyle(order.status),
                            padding: "7px 12px",
                            borderRadius: "6px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.status}
                        </CBadge>

                        <CFormSelect
                          size="sm"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value
                            )
                          }
                          style={{
                            width: "125px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E6C5DE",
                            borderRadius: "7px",
                            color: "#111111",
                            cursor: "pointer",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </CFormSelect>
                      </div>
                    </CTableDataCell>

                    {/* Date */}
                    <CTableDataCell
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <span style={{ color: "#7A6A76" }}>
                        {order.date}
                      </span>
                    </CTableDataCell>

                    {/* Payment */}
                    <CTableDataCell
                      style={{
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      <CBadge
                        style={{
                          ...getPaymentStyle(order.payment),
                          padding: "7px 12px",
                          borderRadius: "6px",
                          fontWeight: 600,
                        }}
                      >
                        {order.payment}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Orders;

