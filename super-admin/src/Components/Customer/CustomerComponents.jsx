import React, { useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilSearch, cilTrash } from "@coreui/icons";

const CustomerComponents = () => {
  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: "CUS001",
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      orders: 12,
      spent: "₹24,500",
      lastOrder: "28 Aug 2026",
      status: "Active",
    },
    {
      id: "CUS002",
      name: "Aman Khan",
      email: "aman@gmail.com",
      phone: "+91 9123456780",
      orders: 8,
      spent: "₹15,200",
      lastOrder: "26 Aug 2026",
      status: "Active",
    },
    {
      id: "CUS003",
      name: "Priya Verma",
      email: "priya@gmail.com",
      phone: "+91 9988776655",
      orders: 5,
      spent: "₹9,800",
      lastOrder: "22 Aug 2026",
      status: "Inactive",
    },
    {
      id: "CUS004",
      name: "Arjun Patel",
      email: "arjun@gmail.com",
      phone: "+91 9090909090",
      orders: 15,
      spent: "₹32,700",
      lastOrder: "20 Aug 2026",
      status: "Active",
    },
    {
      id: "CUS005",
      name: "Sneha Singh",
      email: "sneha@gmail.com",
      phone: "+91 9876501234",
      orders: 3,
      spent: "₹5,400",
      lastOrder: "18 Aug 2026",
      status: "Active",
    },
  ]);

  // Search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase()),
  );

  // Delete Customer
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (confirmDelete) {
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== id),
      );
    }
  };

  // Stats
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0,
  );

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* Page Header */}
      <CRow className="mb-4">
        <CCol>
          <h3
            className="fw-bold mb-1"
            style={{ color: "#111111" }}
          >
            Customers
          </h3>

          <p
            className="mb-0"
            style={{ color: "#7A6A76" }}
          >
            Manage and view all your customers
          </p>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4">
        {/* Total Customers */}
        <CCol md={4} className="mb-3 mb-md-0">
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <p
                className="mb-1"
                style={{ color: "#7A6A76" }}
              >
                Total Customers
              </p>

              <h3
                className="fw-bold mb-0"
                style={{ color: "#70207B" }}
              >
                {totalCustomers}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Active Customers */}
        <CCol md={4} className="mb-3 mb-md-0">
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <p
                className="mb-1"
                style={{ color: "#7A6A76" }}
              >
                Active Customers
              </p>

              <h3
                className="fw-bold mb-0"
                style={{ color: "#B83E91" }}
              >
                {activeCustomers}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Orders */}
        <CCol md={4}>
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <p
                className="mb-1"
                style={{ color: "#7A6A76" }}
              >
                Total Orders
              </p>

              <h3
                className="fw-bold mb-0"
                style={{ color: "#B52AC2" }}
              >
                {totalOrders}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Customers Card */}
      <CCard
        className="shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <CCardHeader
          className="py-3"
          style={{
            backgroundColor: "#FFF4FA",
            borderBottom: "1px solid #E6C5DE",
          }}
        >
          <CRow className="align-items-center">
            {/* Title */}
            <CCol md={6}>
              <h5
                className="mb-0 fw-semibold"
                style={{ color: "#111111" }}
              >
                All Customers
              </h5>
            </CCol>

            {/* Search */}
            <CCol md={6} className="mt-3 mt-md-0">
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
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5"
                  style={{
                    border: "1px solid #E6C5DE",
                    borderRadius: "8px",
                    color: "#111111",
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>
            </CCol>
          </CRow>
        </CCardHeader>

        {/* Table */}
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable
              hover
              align="middle"
              className="mb-0"
              style={{
                minWidth: "900px",
              }}
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    className="px-4 py-3"
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
                    Phone
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Orders
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Total Spent
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Last Order
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
                    className="text-end px-4"
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <CTableRow key={customer.id}>
                      {/* Customer */}
                      <CTableDataCell
                        className="px-4 py-3"
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <div>
                          <div
                            className="fw-semibold"
                            style={{ color: "#111111" }}
                          >
                            {customer.name}
                          </div>

                          <small style={{ color: "#7A6A76" }}>
                            {customer.email}
                          </small>

                          <div>
                            <small style={{ color: "#7A6A76" }}>
                              {customer.id}
                            </small>
                          </div>
                        </div>
                      </CTableDataCell>

                      {/* Phone */}
                      <CTableDataCell
                        style={{
                          color: "#111111",
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        {customer.phone}
                      </CTableDataCell>

                      {/* Orders */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <span
                          className="fw-semibold"
                          style={{ color: "#B83E91" }}
                        >
                          {customer.orders}
                        </span>
                      </CTableDataCell>

                      {/* Total Spent */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <span
                          className="fw-semibold"
                          style={{ color: "#70207B" }}
                        >
                          {customer.spent}
                        </span>
                      </CTableDataCell>

                      {/* Last Order */}
                      <CTableDataCell
                        style={{
                          color: "#7A6A76",
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        {customer.lastOrder}
                      </CTableDataCell>

                      {/* Status */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <CBadge
                          style={{
                            backgroundColor:
                              customer.status === "Active"
                                ? "#F3E8F1"
                                : "#F5EEF3",
                            color:
                              customer.status === "Active"
                                ? "#70207B"
                                : "#7A6A76",
                            padding: "7px 12px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          {customer.status}
                        </CBadge>
                      </CTableDataCell>

                      {/* Action */}
                      <CTableDataCell
                        className="text-end px-4"
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <CButton
                          variant="outline"
                          size="sm"
                          title="Delete Customer"
                          onClick={() => handleDelete(customer.id)}
                          style={{
                            color: "#B83E91",
                            borderColor: "#E6C5DE",
                            backgroundColor: "#FFF4FA",
                          }}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={7}
                      className="text-center py-5"
                    >
                      <div style={{ color: "#7A6A76" }}>
                        No customers found
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CustomerComponents;

