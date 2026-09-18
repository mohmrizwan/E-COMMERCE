import React, { useEffect, useState } from "react";
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilOptions, cilPencil, cilTrash } from "@coreui/icons";
import ProductLoader from "../ProductLoader";
import Alert from "@mui/material/Alert";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

const ProductTable = ({ search, category, status }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState([]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "" || product.category === category;

    const matchesStatus =
      status === "" || product.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleProducts = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("vendorToken");

      const response = await axios.get(
        "http://localhost:3000/vendor/products/getAllProducts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts(response.data.products);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleProducts();
  }, []);

  const getStatusColor = (stockQuantity) => {
    if (stockQuantity === 0) return "danger";
    if (stockQuantity <= 5) return "warning";
    return "success";
  };

  return (
    <>
      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Table */}
      {loading ? (
        <ProductLoader />
      ) : (
        <CTable hover responsive align="middle" className="mb-0">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="text-body-secondary py-3 ps-4">
                Product
              </CTableHeaderCell>

              <CTableHeaderCell className="text-body-secondary">
                Category
              </CTableHeaderCell>

              <CTableHeaderCell className="text-body-secondary">
                Price
              </CTableHeaderCell>

              <CTableHeaderCell className="text-body-secondary">
                Stock
              </CTableHeaderCell>

              <CTableHeaderCell className="text-body-secondary">
                Status
              </CTableHeaderCell>

              <CTableHeaderCell className="text-body-secondary text-end pe-4">
                Actions
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {filteredProducts.map((product) => (
              <CTableRow key={product._id}>
                {/* Product */}
                <CTableDataCell className="ps-4">
                  <div className="d-flex align-items-center gap-3">
                    <CAvatar color="light" size="lg">
                      {product.name.charAt(0)}
                    </CAvatar>

                    <div>
                      <div className="fw-semibold">
                        {product.name}
                      </div>

                      <small className="text-body-secondary">
                        Product #{product._id}
                      </small>
                    </div>
                  </div>
                </CTableDataCell>

                {/* Category */}
                <CTableDataCell>
                  <span className="text-body-secondary">
                    {product.category}
                  </span>
                </CTableDataCell>

                {/* Price */}
                <CTableDataCell>
                  <span className="fw-semibold">
                    ${product.pricing}
                  </span>
                </CTableDataCell>

                {/* Stock */}
                <CTableDataCell>
                  <span
                    className={
                      product.stockQuantity === 0
                        ? "text-danger fw-semibold"
                        : product.stockQuantity <= 5
                          ? "text-warning fw-semibold"
                          : "fw-semibold"
                    }
                  >
                    {product.stockQuantity}
                  </span>
                </CTableDataCell>

                {/* Status */}
                <CTableDataCell>
                  <CBadge
                    color={getStatusColor(product.stockQuantity)}
                    shape="rounded-pill"
                    className="px-3 py-2"
                  >
                    {product.stockQuantity === 0
                      ? "Out of Stock"
                      : product.status}
                  </CBadge>
                </CTableDataCell>

                {/* Actions */}
                <CTableDataCell className="text-end pe-4">
                  <CDropdown direction="dropstart">
                    <CDropdownToggle
                      color="transparent"
                      caret={false}
                      className="p-1"
                    >
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>

                    <CDropdownMenu>
                      <CDropdownItem href="/products/update">
                        <CIcon
                          icon={cilPencil}
                          className="me-2"
                        />
                        Edit
                      </CDropdownItem>

                      <CDropdownItem className="text-danger">
                        <CIcon
                          icon={cilTrash}
                          className="me-2"
                        />
                        Delete
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </>
  );
};

export default ProductTable;

