import { useEffect, useState } from "react";
import axios from "axios";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAvatar,
  CBadge,
} from "@coreui/react";

const API_URL ="https://ecommerceba-6dtt.onrender.com";
const RecentCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getRecentCustomers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/dashboard/recent-customers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
            },
          },
        );
        setCustomers(response.data.recentCustomers || []);
      } catch (error) {
        console.error(
          "Could not load recent customers:",
          error.response?.data?.message || error.message,
        );
      }
    };

    getRecentCustomers();
  }, []);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <CTable
      hover
      responsive
      align="middle"
      className="mb-0"
    >
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell className="text-body-secondary">
            Customer
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Orders
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Total Spent
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Status
          </CTableHeaderCell>

          <CTableHeaderCell className="text-body-secondary">
            Joined
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {customers.map((customer) => (
          <CTableRow key={customer.id}>

            {/* Customer */}
            <CTableDataCell>
              <div className="d-flex align-items-center gap-3">

                <CAvatar
                  color="primary"
                  textColor="white"
                  size="md"
                >
                  {customer.name.charAt(0)}
                </CAvatar>

                <div>
                  <div className="fw-semibold">
                    {customer.name}
                  </div>

                  <small className="text-body-secondary">
                    {customer.email}
                  </small>
                </div>

              </div>
            </CTableDataCell>

            {/* Orders */}
            <CTableDataCell>
              <span className="fw-semibold">
                {customer.orders}
              </span>
            </CTableDataCell>

            {/* Total Spent */}
            <CTableDataCell>
              <span className="fw-bold">
                {formatAmount(customer.spent)}
              </span>
            </CTableDataCell>

            {/* Status */}
            <CTableDataCell>
              <CBadge
                color={
                  customer.status === "Active"
                    ? "success"
                    : "secondary"
                }
                shape="rounded-pill"
                className="px-3 py-2"
              >
                {customer.status}
              </CBadge>
            </CTableDataCell>

            {/* Joined */}
            <CTableDataCell>
              <span className="text-body-secondary">
                {formatDate(customer.joined)}
              </span>
            </CTableDataCell>

          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default RecentCustomers;