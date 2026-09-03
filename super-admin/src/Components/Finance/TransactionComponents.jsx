import React, { useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [period, setPeriod] = useState("This Month");

  const [transactions] = useState([
    {
      id: "TXN-1001",
      orderId: "ORD-1001",
      customer: "Rahul Sharma",
      paymentMethod: "Online",
      amount: "₹4,500",
      commission: "₹450",
      earning: "₹4,050",
      status: "Completed",
      date: "28 Aug 2026",
    },
    {
      id: "TXN-1002",
      orderId: "ORD-1002",
      customer: "Aman Khan",
      paymentMethod: "COD",
      amount: "₹6,200",
      commission: "₹620",
      earning: "₹5,580",
      status: "Pending",
      date: "27 Aug 2026",
    },
    {
      id: "TXN-1003",
      orderId: "ORD-1003",
      customer: "Priya Verma",
      paymentMethod: "Online",
      amount: "₹3,800",
      commission: "₹380",
      earning: "₹3,420",
      status: "Completed",
      date: "25 Aug 2026",
    },
    {
      id: "TXN-1004",
      orderId: "ORD-1004",
      customer: "Arjun Patel",
      paymentMethod: "COD",
      amount: "₹2,900",
      commission: "₹290",
      earning: "₹2,610",
      status: "Pending",
      date: "23 Aug 2026",
    },
    {
      id: "TXN-1005",
      orderId: "ORD-1005",
      customer: "Sneha Singh",
      paymentMethod: "Online",
      amount: "₹3,500",
      commission: "₹350",
      earning: "₹3,150",
      status: "Completed",
      date: "21 Aug 2026",
    },
    {
      id: "TXN-1006",
      orderId: "ORD-1006",
      customer: "Vikash Gupta",
      paymentMethod: "Online",
      amount: "₹5,800",
      commission: "₹580",
      earning: "₹5,220",
      status: "Failed",
      date: "19 Aug 2026",
    },
  ]);

  // Filters
  const filteredTransactions = transactions.filter((transaction) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      transaction.id.toLowerCase().includes(searchValue) ||
      transaction.orderId.toLowerCase().includes(searchValue) ||
      transaction.customer.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      transaction.status === statusFilter;

    const matchesPayment =
      paymentFilter === "All" ||
      transaction.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Stats
  const totalTransactions = transactions.length;

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "Completed",
  ).length;

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <CRow className="mb-4 align-items-center">
        <CCol md={8}>
          <h3
            className="fw-bold mb-1"
            style={{ color: "#111111" }}
          >
            Transactions
          </h3>

          <p
            className="mb-0"
            style={{ color: "#7A6A76" }}
          >
            View and manage all your financial transactions
          </p>
        </CCol>

        <CCol md={4} className="mt-3 mt-md-0">
          <CFormSelect
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6C5DE",
              borderRadius: "8px",
              color: "#111111",
            }}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Stats */}
      <CRow className="mb-4">
        {/* Total Transactions */}
        <CCol md={4} className="mb-3 mb-md-0">
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <p
                className="mb-1"
                style={{ color: "#7A6A76" }}
              >
                Total Transactions
              </p>

              <h3
                className="fw-bold mb-0"
                style={{ color: "#70207B" }}
              >
                {totalTransactions}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Completed */}
        <CCol md={4} className="mb-3 mb-md-0">
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <p
                className="mb-1"
                style={{ color: "#7A6A76" }}
              >
                Completed
              </p>

              <h3
                className="fw-bold mb-0"
                style={{ color: "#B83E91" }}
              >
                {completedTransactions}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Pending */}
        <CCol md={4}>
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <p
                className="mb-1"
                style={{ color: "#7A6A76" }}
              >
                Pending
              </p>

              <h3
                className="fw-bold mb-0"
                style={{ color: "#B52AC2" }}
              >
                {pendingTransactions}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Transactions Card */}
      <CCard
        className="shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <CCardHeader
          className="py-3"
          style={{
            backgroundColor: "#FFF4FA",
            borderBottom: "1px solid #E6C5DE",
          }}
        >
          <CRow className="align-items-center">
            {/* Title */}
            <CCol lg={4}>
              <h5
                className="fw-semibold mb-0"
                style={{ color: "#111111" }}
              >
                All Transactions
              </h5>
            </CCol>

            {/* Search */}
            <CCol
              lg={4}
              className="mt-3 mt-lg-0"
            >
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
                  placeholder="Search transaction..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6C5DE",
                    borderRadius: "8px",
                    color: "#111111",
                  }}
                />
              </div>
            </CCol>

            {/* Status Filter */}
            <CCol
              lg={2}
              className="mt-3 mt-lg-0"
            >
              <CFormSelect
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </CFormSelect>
            </CCol>

            {/* Payment Filter */}
            <CCol
              lg={2}
              className="mt-3 mt-lg-0"
            >
              <CFormSelect
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value)
                }
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              >
                <option value="All">All Payments</option>
                <option value="Online">Online</option>
                <option value="COD">COD</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardHeader>

        {/* Table */}
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable
              hover
              align="middle"
              className="mb-0"
              style={{
                minWidth: "1050px",
              }}
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    className="px-4 py-3"
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Transaction
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Customer
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Payment
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Amount
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Commission
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Your Earning
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Status
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Date
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <CTableRow key={transaction.id}>
                      {/* Transaction */}
                      <CTableDataCell
                        className="px-4 py-3"
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <div
                          className="fw-semibold"
                          style={{ color: "#B83E91" }}
                        >
                          {transaction.id}
                        </div>

                        <small style={{ color: "#7A6A76" }}>
                          {transaction.orderId}
                        </small>
                      </CTableDataCell>

                      {/* Customer */}
                      <CTableDataCell
                        style={{
                          color: "#111111",
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        {transaction.customer}
                      </CTableDataCell>

                      {/* Payment */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <CBadge
                          style={{
                            backgroundColor:
                              transaction.paymentMethod === "Online"
                                ? "#F1E8F5"
                                : "#F5EEF3",
                            color:
                              transaction.paymentMethod === "Online"
                                ? "#8B2595"
                                : "#7A6A76",
                            padding: "7px 12px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          {transaction.paymentMethod}
                        </CBadge>
                      </CTableDataCell>

                      {/* Amount */}
                      <CTableDataCell
                        style={{
                          color: "#111111",
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        {transaction.amount}
                      </CTableDataCell>

                      {/* Commission */}
                      <CTableDataCell
                        style={{
                          color: "#7A6A76",
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        {transaction.commission}
                      </CTableDataCell>

                      {/* Earning */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <span
                          className="fw-semibold"
                          style={{ color: "#70207B" }}
                        >
                          {transaction.earning}
                        </span>
                      </CTableDataCell>

                      {/* Status */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <CBadge
                          style={{
                            backgroundColor:
                              transaction.status === "Completed"
                                ? "#F3E8F1"
                                : transaction.status === "Pending"
                                ? "#FFF4FA"
                                : "#F5EEF3",
                            color:
                              transaction.status === "Completed"
                                ? "#70207B"
                                : transaction.status === "Pending"
                                ? "#B83E91"
                                : "#7A6A76",
                            padding: "7px 12px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          {transaction.status}
                        </CBadge>
                      </CTableDataCell>

                      {/* Date */}
                      <CTableDataCell
                        style={{
                          color: "#7A6A76",
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        {transaction.date}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={8}
                      className="text-center py-5"
                      style={{
                        color: "#7A6A76",
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      No transactions found
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

export default Transactions;

