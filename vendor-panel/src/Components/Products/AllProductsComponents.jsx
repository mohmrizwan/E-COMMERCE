import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/categories.js";
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await getCategories();
        setCategories(list);
      } catch (error) {
        console.error("Could not load categories.", error);
      }
    };

    loadCategories();
  }, []);

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

        <CButton className="!bg-[#173D35] !text-white" href="/products/add">
          <CIcon icon={cilPlus} className="me-2" />
          Add Product
        </CButton>
      </div>

      {/* Filters */}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5"
                  placeholder="Search products..."
                />
              </div>
            </CCol>

            {/* Category */}
            <CCol md={3}>
              <CFormSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Status */}
            <CCol md={3}>
              <CFormSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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

      {/* Products Table */}
      <CCard className="border-0 shadow-sm">
        <CCardBody className="p-0">
          <ProductTable
            search={search}
            category={category}
            status={status}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AllProducts;

