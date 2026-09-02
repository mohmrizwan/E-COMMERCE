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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-semibold mb-1">All Products</h3>
          <p className="text-body-secondary mb-0">
            Manage all products in your store
          </p>
        </div>

        <CButton color="primary" href="/products/add">
          <CIcon icon={cilPlus} className="me-2" />
          Add Product
        </CButton>
      </div>

      {/* Filters */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={6}>
              <div className="position-relative">
                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
                />

                <CFormInput className="ps-5" placeholder="Search products..." />
              </div>
            </CCol>

            <CCol md={3}>
              <CFormSelect>
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormSelect>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Products Table */}
      <CCard className="border-0 shadow-sm">
        <CCardBody className="p-0">
          <ProductTable />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AllProducts;
