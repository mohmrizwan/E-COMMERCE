import React, { useState } from "react";
import {
  CBadge,
  CButton,
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
import { cilSearch, cilOptions } from "@coreui/icons";

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
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    // Backend API baad mein yahan connect karenge
    console.log("Order:", orderId);
    console.log("New Status:", newStatus);
  };

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";

 
      case "Processing":
        return "primary";

      case "Shipped":
        return "info";

      case "Cancelled":
        return "danger";

      default:
        return "secondary";
    }
  };

  return (
    <div>
      {/* ================= Header ================= */}
      <div className="mb-4">
        <h3 className="fw-semibold mb-1">Orders</h3>

        <p className="text-body-secondary mb-0">
          Manage and track all customer orders
        </p>
      </div>

      {/* ================= Filters ================= */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <CRow className="g-3">
            {/* Search */}
            <CCol md={6}>
              <div className="position-relative">
                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
                />

                <CFormInput
                  placeholder="Search by order ID or customer..."
                  className="ps-5"
                />
              </div>
            </CCol>

            {/* Status Filter */}
            <CCol md={3}>
              <CFormSelect>
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
              <CFormSelect>
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
      <CCard className="border-0 shadow-sm">
        {/* Table Header */}
        <CCardHeader className="bg-transparent border-0 px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-semibold mb-1">All Orders</h5>

              <small className="text-body-secondary">
                {orders.length} orders found
              </small>
            </div>
          </div>
        </CCardHeader>

        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            {/* ================= Table Head ================= */}
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="ps-4 text-body-secondary">
                  Order ID
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Customer
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Products
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Total
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Status
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Date
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Payment
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            {/* ================= Table Body ================= */}
            <CTableBody>
              {orders.map((order) => (
                <CTableRow key={order.id}>
                  {/* Order ID */}
                  <CTableDataCell className="ps-4">
                    <span className="fw-semibold text-primary">{order.id}</span>
                  </CTableDataCell>

                  {/* Customer */}
                  <CTableDataCell>
                    <div className="fw-semibold">{order.customer}</div>

                    <small className="text-body-secondary">{order.email}</small>
                  </CTableDataCell>

                  {/* Products */}
                  <CTableDataCell>
                    <div className="fw-medium">{order.products}</div>

                    <small className="text-body-secondary">
                      {order.items} items
                    </small>
                  </CTableDataCell>

                  {/* Total */}
                  <CTableDataCell>
                    <span className="fw-bold">{order.total}</span>
                  </CTableDataCell>

                  {/* Status */}
                  <CTableDataCell>
                    <div className="d-flex align-items-center gap-2">
                      <CBadge
                        color={getStatusColor(order.status)}
                        shape="rounded-pill"
                        className="px-3 py-2"
                      >
                        {order.status}
                      </CBadge>

                      <CFormSelect
                        size="sm"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        style={{
                          width: "125px",
                          cursor: "pointer",
                        }}
                      >
    

                        <option value="Processing">Processing</option>

                        <option value="Shipped">Shipped</option>

                        <option value="Delivered">Delivered</option>

                        <option value="Cancelled">Cancelled</option>
                      </CFormSelect>
                    </div>
                  </CTableDataCell>

                  {/* Date */}
                  <CTableDataCell>
                    <span className="text-body-secondary">{order.date}</span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={order.payment === "Paid" ? "success" : "warning"}
                      shape="rounded-pill"
                    >
                      {order.payment}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Orders;
