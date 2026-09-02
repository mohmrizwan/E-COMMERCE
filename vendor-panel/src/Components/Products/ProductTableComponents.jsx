import React from "react";
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
import {
  cilOptions,
  cilPencil,
  cilTrash,
  cilInfo,
} from "@coreui/icons";

const ProductTable = () => {
  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      category: "Shoes",
      price: "₹4,999",
      stock: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: "₹2,999",
      stock: 12,
      status: "Active",
    },
    {
      id: 3,
      name: "Premium T-Shirt",
      category: "Fashion",
      price: "₹899",
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 4,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "₹1,999",
      stock: 18,
      status: "Active",
    },
    {
      id: 5,
      name: "Leather Wallet",
      category: "Accessories",
      price: "₹1,299",
      stock: 5,
      status: "Inactive",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Active") return "success";
    if (status === "Out of Stock") return "danger";
    return "secondary";
  };

  return (
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
        {products.map((product) => (
          <CTableRow key={product.id}>

            {/* Product */}
            <CTableDataCell className="ps-4">
              <div className="d-flex align-items-center gap-3">

                <CAvatar
                  color="light"
                  size="lg"
                >
                  {product.name.charAt(0)}
                </CAvatar>

                <div>
                  <div className="fw-semibold">
                    {product.name}
                  </div>

                  <small className="text-body-secondary">
                    Product #{product.id}
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
                {product.price}
              </span>
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
                {product.stock}
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

                  <CDropdownItem>
                    <CIcon icon={cilInfo} className="me-2" />
                    View
                  </CDropdownItem>

                  <CDropdownItem 
                  href="/products/add">
                    <CIcon icon={cilPencil} className="me-2" />
                    Edit
                  </CDropdownItem>

                  <CDropdownItem className="text-danger">
                    <CIcon icon={cilTrash} className="me-2" />
                    Delete
                  </CDropdownItem>

                </CDropdownMenu>

              </CDropdown>

            </CTableDataCell>

          </CTableRow>
        ))}
      </CTableBody>

    </CTable>
  );
};

export default ProductTable;