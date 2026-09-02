import React from "react";
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

const RecentCustomers = () => {
  const customers = [
    {
      id: 1,
      name: "Mohammad Rizwan",
      email: "rizwan@gmail.com",
      orders: 12,
      spent: "₹24,500",
      status: "Active",
      joined: "01 Sep 2026",
    },
    {
      id: 2,
      name: "Aman Sharma",
      email: "aman@gmail.com",
      orders: 8,
      spent: "₹18,200",
      status: "Active",
      joined: "31 Aug 2026",
    },
    {
      id: 3,
      name: "Rahul Verma",
      email: "rahul@gmail.com",
      orders: 6,
      spent: "₹12,800",
      status: "Active",
      joined: "30 Aug 2026",
    },
    {
      id: 4,
      name: "Arjun Singh",
      email: "arjun@gmail.com",
      orders: 4,
      spent: "₹8,450",
      status: "Inactive",
      joined: "29 Aug 2026",
    },
    {
      id: 5,
      name: "Priya Patel",
      email: "priya@gmail.com",
      orders: 9,
      spent: "₹16,700",
      status: "Active",
      joined: "28 Aug 2026",
    },
  ];

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
                {customer.spent}
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
                {customer.joined}
              </span>
            </CTableDataCell>

          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default RecentCustomers;