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
import { cilOptions, cilSearch, cilTrash } from "@coreui/icons";

const CustomerComponents = () => {
  const [search, setSearch] = useState("");

  const [customers] = useState([
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
    <div className="p-3">
      {/* Page Header */}
      <CRow className="mb-4">
        <CCol>
          <h3 className="fw-bold mb-1">Customers</h3>

          <p className="text-body-secondary mb-0">
            Manage and view all your customers
          </p>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4">
        {/* Total Customers */}
        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody>
              <p className="text-body-secondary mb-1">Total Customers</p>

              <h3 className="fw-bold mb-0">{totalCustomers}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Active Customers */}
        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody>
              <p className="text-body-secondary mb-1">Active Customers</p>

              <h3 className="fw-bold mb-0">{activeCustomers}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Orders */}
        <CCol md={4}>
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody>
              <p className="text-body-secondary mb-1">Total Orders</p>

              <h3 className="fw-bold mb-0">{totalOrders}</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Customers Card */}
      <CCard className="border-0 shadow-sm">
        {/* Header */}
        <CCardHeader className="bg-white py-3">
          <CRow className="align-items-center">
            {/* Title */}
            <CCol md={6}>
              <h5 className="mb-0 fw-semibold">All Customers</h5>
            </CCol>

            {/* Search */}
            <CCol md={6} className="mt-3 mt-md-0">
              <div className="position-relative">
                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
                />

                <CFormInput
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5"
                />
              </div>
            </CCol>
          </CRow>
        </CCardHeader>

        {/* Table */}
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable hover align="middle" className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="px-4">Customer</CTableHeaderCell>

                  <CTableHeaderCell>Phone</CTableHeaderCell>

                  <CTableHeaderCell>Orders</CTableHeaderCell>

                  <CTableHeaderCell>Total Spent</CTableHeaderCell>

                  <CTableHeaderCell>Last Order</CTableHeaderCell>

                  <CTableHeaderCell>Status</CTableHeaderCell>
                  
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <CTableRow key={customer.id}>
                      {/* Customer */}
                      <CTableDataCell className="px-4">
                        <div>
                          <div className="fw-semibold">{customer.name}</div>

                          <small className="text-body-secondary">
                            {customer.email}
                          </small>

                          <div>
                            <small className="text-body-secondary">
                              {customer.id}
                            </small>
                          </div>
                        </div>
                      </CTableDataCell>

                      {/* Phone */}
                      <CTableDataCell>{customer.phone}</CTableDataCell>

                      {/* Orders */}
                      <CTableDataCell>
                        <span className="fw-semibold">{customer.orders}</span>
                      </CTableDataCell>

                      {/* Total Spent */}
                      <CTableDataCell>
                        <span className="fw-semibold">{customer.spent}</span>
                      </CTableDataCell>

                      {/* Last Order */}
                      <CTableDataCell>{customer.lastOrder}</CTableDataCell>

                      {/* Status */}
                      <CTableDataCell>
                        <CBadge
                          color={
                            customer.status === "Active"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {customer.status}
                        </CBadge>
                      </CTableDataCell>

                      {/* Action */}
                      <CTableDataCell className="text-end px-4">
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          title="Delete Customer"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-5">
                      <div className="text-body-secondary">
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
