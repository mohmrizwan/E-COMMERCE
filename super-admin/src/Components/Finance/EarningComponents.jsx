import React, { useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
const Earnings = () => {
  const [period, setPeriod] = useState("This Month");
  const earnings = [
    {
      id: "ORD-1001",
      product: "Nike Air Max 270",
      orderAmount: "₹4,500",
      commission: "₹450",
      earning: "₹4,050",
      status: "Completed",
      date: "28 Aug 2026",
    },
    {
      id: "ORD-1002",
      product: "Adidas Ultraboost",
      orderAmount: "₹6,200",
      commission: "₹620",
      earning: "₹5,580",
      status: "Completed",
      date: "27 Aug 2026",
    },
    {
      id: "ORD-1003",
      product: "Puma Running Shoes",
      orderAmount: "₹3,800",
      commission: "₹380",
      earning: "₹3,420",
      status: "Pending",
      date: "25 Aug 2026",
    },
    {
      id: "ORD-1004",
      product: "Nike Revolution 6",
      orderAmount: "₹2,900",
      commission: "₹290",
      earning: "₹2,610",
      status: "Completed",
      date: "23 Aug 2026",
    },
    {
      id: "ORD-1005",
      product: "Adidas Runfalcon",
      orderAmount: "₹3,500",
      commission: "₹350",
      earning: "₹3,150",
      status: "Pending",
      date: "21 Aug 2026",
    },
  ];
  return (
    <div
      className="p-3"
      style={{ backgroundColor: "#FFFFFF", minHeight: "100%" }}
    >
      {" "}
      {/* Header */}{" "}
      <CRow className="mb-4 align-items-center">
        {" "}
        <CCol md={8}>
          {" "}
          <h3 className="fw-bold mb-1" style={{ color: "#111111" }}>
            {" "}
            Earnings{" "}
          </h3>{" "}
          <p className="mb-0" style={{ color: "#7A6A76" }}>
            {" "}
            Track your earnings and revenue from orders{" "}
          </p>{" "}
        </CCol>{" "}
        <CCol md={4} className="mt-3 mt-md-0">
          {" "}
          <CFormSelect
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              border: "1px solid #E6C5DE",
              borderRadius: "8px",
              color: "#111111",
              backgroundColor: "#FFFFFF",
            }}
          >
            {" "}
            <option>This Month</option> <option>Last Month</option>{" "}
            <option>Last 3 Months</option> <option>This Year</option>{" "}
          </CFormSelect>{" "}
        </CCol>{" "}
      </CRow>{" "}
      {/* Earnings Cards */}{" "}
      <CRow className="mb-4">
        {" "}
        {/* Total Earnings */}{" "}
        <CCol md={3} sm={6} className="mb-3">
          {" "}
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            {" "}
            <CCardBody>
              {" "}
              <p className="mb-1" style={{ color: "#7A6A76" }}>
                {" "}
                Total Earnings{" "}
              </p>{" "}
              <h3 className="fw-bold mb-1" style={{ color: "#70207B" }}>
                {" "}
                ₹18,810{" "}
              </h3>{" "}
              <small style={{ color: "#B83E91" }}>
                {" "}
                +12.5% from last month{" "}
              </small>{" "}
            </CCardBody>{" "}
          </CCard>{" "}
        </CCol>{" "}
        {/* Available */}{" "}
        <CCol md={3} sm={6} className="mb-3">
          {" "}
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            {" "}
            <CCardBody>
              {" "}
              <p className="mb-1" style={{ color: "#7A6A76" }}>
                {" "}
                Available Earnings{" "}
              </p>{" "}
              <h3 className="fw-bold mb-1" style={{ color: "#8B2595" }}>
                {" "}
                ₹12,450{" "}
              </h3>{" "}
              <small style={{ color: "#7A6A76" }}>
                {" "}
                Ready for payout{" "}
              </small>{" "}
            </CCardBody>{" "}
          </CCard>{" "}
        </CCol>{" "}
        {/* Pending */}{" "}
        <CCol md={3} sm={6} className="mb-3">
          {" "}
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            {" "}
            <CCardBody>
              {" "}
              <p className="mb-1" style={{ color: "#7A6A76" }}>
                {" "}
                Pending Earnings{" "}
              </p>{" "}
              <h3 className="fw-bold mb-1" style={{ color: "#B52AC2" }}>
                {" "}
                ₹6,360{" "}
              </h3>{" "}
              <small style={{ color: "#B83E91" }}> Processing </small>{" "}
            </CCardBody>{" "}
          </CCard>{" "}
        </CCol>{" "}
        {/* Commission */}{" "}
        <CCol md={3} sm={6} className="mb-3">
          {" "}
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            {" "}
            <CCardBody>
              {" "}
              <p className="mb-1" style={{ color: "#7A6A76" }}>
                {" "}
                Platform Commission{" "}
              </p>{" "}
              <h3 className="fw-bold mb-1" style={{ color: "#B83E91" }}>
                {" "}
                ₹2,090{" "}
              </h3>{" "}
              <small style={{ color: "#7A6A76" }}> This month </small>{" "}
            </CCardBody>{" "}
          </CCard>{" "}
        </CCol>{" "}
      </CRow>{" "}
      {/* Earnings Table */}{" "}
      <CCard
        className="shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {" "}
        {/* Header */}{" "}
        <CCardHeader
          className="py-3"
          style={{
            backgroundColor: "#FFF4FA",
            borderBottom: "1px solid #E6C5DE",
          }}
        >
          {" "}
          <h5 className="fw-semibold mb-0" style={{ color: "#111111" }}>
            {" "}
            Recent Earnings{" "}
          </h5>{" "}
        </CCardHeader>{" "}
        {/* Table */}{" "}
        <CCardBody className="p-0">
          {" "}
          <div className="table-responsive">
            {" "}
            <CTable
              hover
              align="middle"
              className="mb-0"
              style={{ minWidth: "900px" }}
            >
              {" "}
              <CTableHead>
                {" "}
                <CTableRow>
                  {" "}
                  <CTableHeaderCell
                    className="px-4 py-3"
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Order ID{" "}
                  </CTableHeaderCell>{" "}
                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Product{" "}
                  </CTableHeaderCell>{" "}
                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Order Amount{" "}
                  </CTableHeaderCell>{" "}
                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Commission{" "}
                  </CTableHeaderCell>{" "}
                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Your Earning{" "}
                  </CTableHeaderCell>{" "}
                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Status{" "}
                  </CTableHeaderCell>{" "}
                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    {" "}
                    Date{" "}
                  </CTableHeaderCell>{" "}
                </CTableRow>{" "}
              </CTableHead>{" "}
              <CTableBody>
                {" "}
                {earnings.map((item) => (
                  <CTableRow key={item.id}>
                    {" "}
                    {/* Order ID */}{" "}
                    <CTableDataCell
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid #F0DCE9" }}
                    >
                      {" "}
                      <span
                        className="fw-semibold"
                        style={{ color: "#B83E91" }}
                      >
                        {" "}
                        {item.id}{" "}
                      </span>{" "}
                    </CTableDataCell>{" "}
                    {/* Product */}{" "}
                    <CTableDataCell
                      style={{
                        color: "#111111",
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      {" "}
                      {item.product}{" "}
                    </CTableDataCell>{" "}
                    {/* Order Amount */}{" "}
                    <CTableDataCell
                      style={{
                        color: "#111111",
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      {" "}
                      {item.orderAmount}{" "}
                    </CTableDataCell>{" "}
                    {/* Commission */}{" "}
                    <CTableDataCell
                      style={{
                        color: "#7A6A76",
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      {" "}
                      {item.commission}{" "}
                    </CTableDataCell>{" "}
                    {/* Your Earning */}{" "}
                    <CTableDataCell
                      style={{ borderBottom: "1px solid #F0DCE9" }}
                    >
                      {" "}
                      <span
                        className="fw-semibold"
                        style={{ color: "#70207B" }}
                      >
                        {" "}
                        {item.earning}{" "}
                      </span>{" "}
                    </CTableDataCell>{" "}
                    {/* Status */}{" "}
                    <CTableDataCell
                      style={{ borderBottom: "1px solid #F0DCE9" }}
                    >
                      {" "}
                      <CBadge
                        style={{
                          backgroundColor:
                            item.status === "Completed" ? "#F3E8F1" : "#FFF4FA",
                          color:
                            item.status === "Completed" ? "#70207B" : "#B83E91",
                          padding: "7px 12px",
                          borderRadius: "6px",
                          fontWeight: 600,
                        }}
                      >
                        {" "}
                        {item.status}{" "}
                      </CBadge>{" "}
                    </CTableDataCell>{" "}
                    {/* Date */}{" "}
                    <CTableDataCell
                      style={{
                        color: "#7A6A76",
                        borderBottom: "1px solid #F0DCE9",
                      }}
                    >
                      {" "}
                      {item.date}{" "}
                    </CTableDataCell>{" "}
                  </CTableRow>
                ))}{" "}
              </CTableBody>{" "}
            </CTable>{" "}
          </div>{" "}
        </CCardBody>{" "}
      </CCard>{" "}
    </div>
  );
};
export default Earnings;
