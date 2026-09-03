import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
} from "@coreui/react";
import { cilPlus, cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import ProductTable from "./ProductTableComponents";

const AllProducts = () => {
  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* ================= Header ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="fw-semibold mb-1"
            style={{ color: "#111111" }}
          >
            All Products
          </h3>

          <p
            className="mb-0"
            style={{ color: "#7A6A76" }}
          >
            Manage all products in your store
          </p>
        </div>

        <CButton
          href="/products/add"
          className="border-0"
          style={{
            backgroundColor: "#B83E91",
            color: "#FFFFFF",
            borderRadius: "8px",
            padding: "9px 16px",
            fontWeight: 600,
          }}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Add Product
        </CButton>
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
                  className="ps-5"
                  placeholder="Search products..."
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6C5DE",
                    borderRadius: "8px",
                    color: "#111111",
                  }}
                />
              </div>
            </CCol>

            {/* Category */}
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
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </CFormSelect>
            </CCol>

            {/* Status */}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= Products Table ================= */}
      <CCard
        className="shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CCardBody className="p-0">
          <ProductTable />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AllProducts;

