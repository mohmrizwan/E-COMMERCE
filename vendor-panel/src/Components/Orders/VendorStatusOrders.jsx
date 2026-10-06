import { useEffect, useState } from "react";
import {
  CBadge,
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
import { cilSearch } from "@coreui/icons";
import axios from "axios";
import ProductLoader from "../ProductLoader";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ecommerceba-6dtt.onrender.com";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "success";
    case "Processing":
      return "primary";
    case "Shipped":
      return "info";
    case "Cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

const VendorStatusOrders = ({ status, title }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/vendor/orders/myOrders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        });

        if (isActive) setOrders(response.data.orders || []);
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.response?.data?.message || "Could not load orders.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadOrders();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredOrders = orders
    .map((order) => {
      const vendorStatus =
        order.status === "Cancelled"
          ? "Cancelled"
          : order.vendorStatus || order.status || "Pending";
      const items = order.items || [];

      return {
        id: order._id,
        customer: order.shippingAddress?.name || order.userId?.name || "Customer",
        email: order.userId?.email || order.shippingAddress?.email || "N/A",
        products: items
          .map((item) => item.productId?.name)
          .filter(Boolean)
          .join(", ") || "Product",
        itemCount: items.reduce((count, item) => count + (item.quantity || 0), 0),
        total: order.finalTotal ?? order.totalAmount ?? 0,
        status: vendorStatus,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A",
        payment: order.paymentStatus || "Pending",
      };
    })
    .filter((order) => {
      const matchesStatus = order.status === status;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [order.id, order.customer, order.email, order.products, order.payment]
          .some((value) => String(value || "").toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-semibold mb-1">{title}</h3>
        <p className="text-body-secondary mb-0">Search and review {title.toLowerCase()}.</p>
      </div>

      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <div className="position-relative">
            <CIcon
              icon={cilSearch}
              className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
            />
            <CFormInput
              placeholder="Search by order ID, customer, email, or product..."
              className="ps-5"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </CCardBody>
      </CCard>

      {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}

      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-transparent border-0 px-4 py-3">
          <h5 className="fw-semibold mb-1">{title}</h5>
          <small className="text-body-secondary">{filteredOrders.length} orders found</small>
        </CCardHeader>
        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="ps-4">Order ID</CTableHeaderCell>
                <CTableHeaderCell>Customer</CTableHeaderCell>
                <CTableHeaderCell>Products</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Payment</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {isLoading && (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="p-0">
                    <ProductLoader />
                  </CTableDataCell>
                </CTableRow>
              )}
              {!isLoading && filteredOrders.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="py-4 text-center">
                    {orders.length ? "No orders match this search." : `No ${title.toLowerCase()} found.`}
                  </CTableDataCell>
                </CTableRow>
              )}
              {!isLoading &&
                filteredOrders.map((order) => (
                  <CTableRow key={order.id}>
                    <CTableDataCell className="ps-4">
                      <span className="fw-semibold text-primary">{order.id}</span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-semibold">{order.customer}</div>
                      <small className="text-body-secondary">{order.email}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-medium">{order.products}</div>
                      <small className="text-body-secondary">{order.itemCount} items</small>
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold">₹{order.total}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(order.status)} shape="rounded-pill">
                        {order.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-body-secondary">{order.date}</CTableDataCell>
                    <CTableDataCell>{order.payment}</CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default VendorStatusOrders;