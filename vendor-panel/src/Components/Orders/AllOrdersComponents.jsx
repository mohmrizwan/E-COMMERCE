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
import { cilSearch, cilChevronBottom, cilChevronRight } from "@coreui/icons";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "#ORD-001",
      customer: "Mohammad Rizwan",
      email: "rizwan@gmail.com",
      phone: "+91 98765 43210",
      address: "123, MG Road, Indore, Madhya Pradesh - 452001",
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
      phone: "+91 91234 56789",
      address: "45, Sector 12, Noida, Uttar Pradesh - 201301",
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
      phone: "+91 99887 66554",
      address: "78, Park Street, Kolkata, West Bengal - 700016",
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
      phone: "+91 90123 45678",
      address: "12, Model Town, Delhi - 110009",
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
      phone: "+91 97654 32109",
      address: "56, Satellite Road, Ahmedabad, Gujarat - 380015",
      products: "Leather Wallet",
      items: 2,
      total: "₹2,598",
      status: "Cancelled",
      date: "30 Aug 2026",
      payment: "Paid",
    },
  ]);

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    console.log("Order:", orderId);
    console.log("New Status:", newStatus);
  };

  // Status ke hisaab se colors — badge, dot dono ke liye yahin se use hoga
  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return { badge: "bg-green-100 text-green-700", dot: "bg-green-600" };
      case "Processing":
        return { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-600" };
      case "Shipped":
        return { badge: "bg-cyan-100 text-cyan-700", dot: "bg-cyan-600" };
      case "Cancelled":
        return { badge: "bg-red-100 text-red-700", dot: "bg-red-600" };
      default:
        return { badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-600" };
    }
  };

  // Ye 2 status "final" hain — inme se aage koi change allowed nahi
  const isFinalStatus = (status) => status === "Delivered" || status === "Cancelled";

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
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="ps-4" style={{ width: "30px" }}></CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Order ID</CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Customer</CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Products</CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Total</CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Date</CTableHeaderCell>
                <CTableHeaderCell className="text-body-secondary">Payment</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const statusStyle = getStatusStyles(order.status);
                const locked = isFinalStatus(order.status);

                return (
                  <React.Fragment key={order.id}>
                    {/* ===== Normal Row ===== */}
                    <CTableRow
                      onClick={() => toggleOrderDetails(order.id)}
                      className={`cursor-pointer transition-colors duration-200 border-l-[3px] ${
                        isExpanded
                          ? "bg-indigo-50 border-l-indigo-600"
                          : "border-l-transparent hover:bg-gray-50"
                      }`}
                    >
                      <CTableDataCell className="ps-4">
                        <CIcon
                          icon={isExpanded ? cilChevronBottom : cilChevronRight}
                          className={`transition-colors duration-200 ${
                            isExpanded ? "text-indigo-600" : "text-gray-400"
                          }`}
                        />
                      </CTableDataCell>

                      <CTableDataCell>
                        <span className="fw-semibold text-primary">{order.id}</span>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="fw-semibold">{order.customer}</div>
                        <small className="text-body-secondary">{order.email}</small>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="fw-medium">{order.products}</div>
                        <small className="text-body-secondary">{order.items} items</small>
                      </CTableDataCell>

                      <CTableDataCell>
                        <span className="fw-bold">{order.total}</span>
                      </CTableDataCell>

                      {/* ===== Status Cell (Delivered/Cancelled locked) ===== */}
                      <CTableDataCell>
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.badge}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                            ></span>
                            {order.status}
                          </span>

                          {/* Delivered ya Cancelled ho gaya toh dropdown nahi dikhega */}
                          {!locked ? (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer hover:border-gray-300 transition-colors"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              Final
                            </span>
                          )}
                        </div>
                      </CTableDataCell>

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

                    {/* ===== Expanded Row ===== */}
                    <CTableRow>
                      <CTableDataCell colSpan={8} className="p-0 border-0">
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-[300px]" : "max-h-0"
                          }`}
                        >
                          <div className="bg-gray-50 border-t border-gray-200 px-6 py-5">
                            <CRow>
                              <CCol md={4}>
                                <strong className="text-xs uppercase tracking-wide text-gray-500">
                                  Customer Info
                                </strong>
                                <p className="mb-1 mt-2">{order.customer}</p>
                                <p className="mb-1 text-body-secondary">{order.email}</p>
                                <p className="mb-0 text-body-secondary">{order.phone}</p>
                              </CCol>

                              <CCol md={4}>
                                <strong className="text-xs uppercase tracking-wide text-gray-500">
                                  Shipping Address
                                </strong>
                                <p className="mb-0 mt-2 text-body-secondary">
                                  {order.address}
                                </p>
                              </CCol>

                              <CCol md={4}>
                                <strong className="text-xs uppercase tracking-wide text-gray-500">
                                  Order Info
                                </strong>
                                <p className="mb-1 mt-2 text-body-secondary">
                                  Items: {order.items}
                                </p>
                                <p className="mb-1 text-body-secondary">
                                  Total: {order.total}
                                </p>
                                <p className="mb-0 text-body-secondary">
                                  Payment: {order.payment}
                                </p>
                              </CCol>
                            </CRow>
                          </div>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  </React.Fragment>
                );
              })}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Orders;