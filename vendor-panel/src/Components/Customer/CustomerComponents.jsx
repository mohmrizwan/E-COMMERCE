import React, { useEffect, useState } from "react";
import axios from "axios";
import Dotter from "../../../../frontend/src/Components/Dotter"


import {
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
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get Customers
  const getCustomers = async () => {
    setLoading(true)
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      if (!vendorToken) {
        console.error("Vendor token not found");
        return;
      }

      const response = await axios.get(
        "https://ecommerceba-6dtt.onrender.com/vendor/customers/myCustomers",
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        },
      );

      console.log("Customers:", response.data);

      setCustomers(response.data.customers || []);

      return response.data;
    } catch (error) {
      console.error("Get Customers Error:", error);

      if (error.response) {
        // console.error("Status:", error.response.status);
        // console.error("Response:", error.response.data);
      } else if (error.request) {
        // console.error("No response from server:", error.request);
      } else {
        // console.error("Request Error:", error.message);
      }

      setCustomers([]);
    }
  };

  // Delete Customer
 

  useEffect(() => {
    getCustomers();
  }, []);

  // Search
  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.userId?.toString().toLowerCase().includes(searchText)
    );
  });

  // Stats
  const totalCustomers = customers.length;

  const totalOrders = customers.reduce(
    (total, customer) => total + (customer.totalOrders || 0),
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
        <CCol md={6} className="mb-3 mb-md-0">
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody>
              <p className="text-body-secondary mb-1">Total Customers</p>

              <h3 className="fw-bold mb-0">{totalCustomers}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Orders */}
        <CCol md={6}>
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

                  <CTableHeaderCell>Customer ID</CTableHeaderCell>

                
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <CTableRow key={customer.userId}>
                      {/* Customer */}
                      <CTableDataCell className="px-4">
                        <div>
                          <div className="fw-semibold">
                            {customer.name || "N/A"}
                          </div>

                          <small className="text-body-secondary">
                            {customer.email || "N/A"}
                          </small>
                        </div>
                      </CTableDataCell>

                      {/* Phone */}
                      <CTableDataCell>{customer.phone || "N/A"}</CTableDataCell>

                      {/* Orders */}
                      <CTableDataCell>
                        <span className="fw-semibold">
                          {customer.totalOrders || 0}
                        </span>
                      </CTableDataCell>

                      {/* Customer ID */}
                      <CTableDataCell>
                        <small className="text-body-secondary">
                          {customer.userId}
                        </small>
                      </CTableDataCell>

                      {/* Action */}
                
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={5} className="text-center py-5">
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
