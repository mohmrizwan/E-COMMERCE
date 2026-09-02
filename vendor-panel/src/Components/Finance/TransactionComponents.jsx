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
    const matchesSearch =
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(search.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(search.toLowerCase());

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
    (transaction) => transaction.status === "Completed"
  ).length;

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending"
  ).length;

  return (
    <div className="p-3">

      {/* Header */}
      <CRow className="mb-4 align-items-center">
        <CCol md={8}>
          <h3 className="fw-bold mb-1">
            Transactions
          </h3>

          <p className="text-body-secondary mb-0">
            View and manage all your financial transactions
          </p>
        </CCol>

        <CCol
          md={4}
          className="mt-3 mt-md-0"
        >
          <CFormSelect>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Stats */}
      <CRow className="mb-4">

        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Total Transactions
              </p>

              <h3 className="fw-bold mb-0">
                {totalTransactions}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Completed
              </p>

              <h3 className="fw-bold mb-0">
                {completedTransactions}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Pending
              </p>

              <h3 className="fw-bold mb-0">
                {pendingTransactions}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>

      {/* Transactions */}
      <CCard className="border-0 shadow-sm">

        <CCardHeader className="bg-white py-3">
          <CRow className="align-items-center">

            {/* Title */}
            <CCol md={4}>
              <h5 className="fw-semibold mb-0">
                All Transactions
              </h5>
            </CCol>

            {/* Search */}
            <CCol md={4} className="mt-3 mt-md-0">
              <div className="position-relative">

                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
                />

                <CFormInput
                  placeholder="Search transaction..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5"
                />

              </div>
            </CCol>

            {/* Filters */}
            <CCol
              md={2}
              className="mt-3 mt-md-0"
            >
              <CFormSelect
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Failed">
                  Failed
                </option>
              </CFormSelect>
            </CCol>

            <CCol
              md={2}
              className="mt-3 mt-md-0"
            >
              <CFormSelect
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value)
                }
              >
                <option value="All">
                  All Payments
                </option>

                <option value="Online">
                  Online
                </option>

                <option value="COD">
                  COD
                </option>
              </CFormSelect>
            </CCol>

          </CRow>
        </CCardHeader>

        {/* Table */}
        <CCardBody className="p-0">

          <div className="table-responsive">

            <CTable hover align="middle" className="mb-0">

              <CTableHead>
                <CTableRow>

                  <CTableHeaderCell className="px-4">
                    Transaction
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Customer
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Payment
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Amount
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Commission
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Your Earning
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Status
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Date
                  </CTableHeaderCell>

                </CTableRow>
              </CTableHead>

              <CTableBody>

                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (

                    <CTableRow key={transaction.id}>

                      {/* Transaction */}
                      <CTableDataCell className="px-4">

                        <div className="fw-semibold">
                          {transaction.id}
                        </div>

                        <small className="text-body-secondary">
                          {transaction.orderId}
                        </small>

                      </CTableDataCell>

                      {/* Customer */}
                      <CTableDataCell>
                        {transaction.customer}
                      </CTableDataCell>

                      {/* Payment */}
                      <CTableDataCell>
                        <CBadge
                          color={
                            transaction.paymentMethod === "Online"
                              ? "info"
                              : "secondary"
                          }
                        >
                          {transaction.paymentMethod}
                        </CBadge>
                      </CTableDataCell>

                      {/* Amount */}
                      <CTableDataCell>
                        {transaction.amount}
                      </CTableDataCell>

                      {/* Commission */}
                      <CTableDataCell>
                        {transaction.commission}
                      </CTableDataCell>

                      {/* Earning */}
                      <CTableDataCell>
                        <span className="fw-semibold">
                          {transaction.earning}
                        </span>
                      </CTableDataCell>

                      {/* Status */}
                      <CTableDataCell>

                        <CBadge
                          color={
                            transaction.status === "Completed"
                              ? "success"
                              : transaction.status === "Pending"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {transaction.status}
                        </CBadge>

                      </CTableDataCell>

                      {/* Date */}
                      <CTableDataCell>
                        {transaction.date}
                      </CTableDataCell>

                    </CTableRow>

                  ))
                ) : (

                  <CTableRow>

                    <CTableDataCell
                      colSpan={8}
                      className="text-center py-5 text-body-secondary"
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