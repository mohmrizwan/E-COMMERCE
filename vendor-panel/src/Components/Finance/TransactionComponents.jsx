import React, { useEffect, useState } from "react";
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

import Loader from "../../../../frontend/src/Components/Loader";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(
        "http://localhost:3000/vendor/transactions/myTransactions",
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        },
      );

      if (response.data.success) {
        setTransactions(response.data.transactions);
        setMessage(response.data.message || "");
        setErrorMessage("");
      }
    } catch (error) {
      console.log("Fetch Transactions Error:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to fetch transactions",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions when page loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filters
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionId = transaction.transactionId || "";
    const orderId = transaction.orderId || "";
    const customer = transaction.customer || "";

    const matchesSearch =
      transactionId.toLowerCase().includes(search.toLowerCase()) ||
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || transaction.status === statusFilter;

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
    <div className="p-3">
      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

      {/* Header */}
      <CRow className="mb-4 align-items-center">
        <CCol md={8}>
          <h3 className="fw-bold mb-1">Transactions</h3>

          <p className="text-body-secondary mb-0">
            View and manage all your financial transactions
          </p>
        </CCol>

        <CCol md={4} className="mt-3 mt-md-0">
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
              <h3 className="fw-bold mb-0">{totalTransactions}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">Completed</p>
              <h3 className="fw-bold mb-0">{completedTransactions}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">Pending</p>
              <h3 className="fw-bold mb-0">{pendingTransactions}</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Transactions */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-white py-3">
          <CRow className="align-items-center">
            <CCol md={4}>
              <h5 className="fw-semibold mb-0">All Transactions</h5>
            </CCol>

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

            <CCol md={2} className="mt-3 mt-md-0">
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </CFormSelect>
            </CCol>

            <CCol md={2} className="mt-3 mt-md-0">
              <CFormSelect
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
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
            <CTable hover align="middle" className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="px-4">
                    Transaction
                  </CTableHeaderCell>

                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Payment</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Commission</CTableHeaderCell>
                  <CTableHeaderCell>Your Earning</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={8}
                      className="text-center py-5"
                    >
                      <Loader />
                    </CTableDataCell>
                  </CTableRow>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <CTableRow
                      key={transaction.transactionId}
                    >
                      {/* Transaction */}
                      <CTableDataCell className="px-4">
                        <div className="fw-semibold">
                          {transaction.transactionId}
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
                        ₹{transaction.amount}
                      </CTableDataCell>

                      {/* Commission */}
                      <CTableDataCell>
                        {transaction.commission || "-"}
                      </CTableDataCell>

                      {/* Earning */}
                      <CTableDataCell>
                        <span className="fw-semibold">
                          {transaction.earning || "-"}
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
                        {transaction.date
                          ? new Date(
                              transaction.date,
                            ).toLocaleDateString("en-IN")
                          : "-"}
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