
import React from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilPencil } from "@coreui/icons";

const Inventory = () => {
  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      sku: "NIKE-001",
      category: "Shoes",
      stock: 45,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Smart Watch",
      sku: "WATCH-002",
      category: "Electronics",
      stock: 12,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Premium T-Shirt",
      sku: "TSHIRT-003",
      category: "Fashion",
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 4,
      name: "Wireless Headphones",
      sku: "HEAD-004",
      category: "Electronics",
      stock: 28,
      status: "In Stock",
    },
    {
      id: 5,
      name: "Leather Wallet",
      sku: "WALLET-005",
      category: "Accessories",
      stock: 4,
      status: "Low Stock",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "In Stock") return "success";
    if (status === "Low Stock") return "warning";
    return "danger";
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-semibold mb-1">
          Inventory
        </h3>

        <p className="text-body-secondary mb-0">
          Manage your product stock and inventory
        </p>
      </div>

      {/* Inventory Card */}
      <CCard className="border-0 shadow-sm">

        <CCardHeader className="bg-transparent border-0 p-4">

          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="fw-semibold mb-1">
                Stock Overview
              </h5>

              <small className="text-body-secondary">
                Track your current product stock
              </small>
            </div>

            {/* Search */}
            <div
              className="position-relative"
              style={{ width: "260px" }}
            >
              <CIcon
                icon={cilSearch}
                className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
              />

              <CFormInput
                placeholder="Search products..."
                className="ps-5"
              />
            </div>

          </div>

        </CCardHeader>

        <CCardBody className="p-0">

          <CTable
            hover
            responsive
            align="middle"
            className="mb-0"
          >

            <CTableHead>
              <CTableRow>

                <CTableHeaderCell className="ps-4 text-body-secondary">
                  Product
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  SKU
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Category
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Stock
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Status
                </CTableHeaderCell>

                <CTableHeaderCell className="text-end pe-4 text-body-secondary">
                  Action
                </CTableHeaderCell>

              </CTableRow>
            </CTableHead>

            <CTableBody>

              {products.map((product) => (

                <CTableRow key={product.id}>

                  {/* Product */}
                  <CTableDataCell className="ps-4">

                    <div className="fw-semibold">
                      {product.name}
                    </div>

                  </CTableDataCell>

                  {/* SKU */}
                  <CTableDataCell>
                    <span className="text-body-secondary">
                      {product.sku}
                    </span>
                  </CTableDataCell>

                  {/* Category */}
                  <CTableDataCell>
                    {product.category}
                  </CTableDataCell>

                  {/* Stock */}
                  <CTableDataCell>

                    <span
                      className={
                        product.stock === 0
                          ? "text-danger fw-semibold"
                          : product.stock <= 5
                          ? "text-warning fw-semibold"
                          : "fw-semibold"
                      }
                    >
                      {product.stock} units
                    </span>

                  </CTableDataCell>

                  {/* Status */}
                  <CTableDataCell>

                    <CBadge
                      color={getStatusColor(product.status)}
                      shape="rounded-pill"
                      className="px-3 py-2"
                    >
                      {product.status}
                    </CBadge>

                  </CTableDataCell>

                  {/* Action */}
                  <CTableDataCell className="text-end pe-4">

                    <CButton
                      href="/products/update"
                      color="light"
                      size="sm"
                      className="border"
                    >
                      <CIcon
                        icon={cilPencil}
                        className="me-1"
                      />
                      Update Stock
                    </CButton>

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

export default Inventory;
