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

import {
  CChartLine,
} from "@coreui/react-chartjs";

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
    <div className="p-3">

      {/* Header */}
      <CRow className="mb-4 align-items-center">
        <CCol md={8}>
          <h3 className="fw-bold mb-1">
            Earnings
          </h3>

          <p className="text-body-secondary mb-0">
            Track your earnings and revenue from orders
          </p>
        </CCol>

        <CCol
          md={4}
          className="mt-3 mt-md-0"
        >
          <CFormSelect
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Earnings Cards */}
      <CRow className="mb-4">

        {/* Total Earnings */}
        <CCol md={3} sm={6} className="mb-3">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Total Earnings
              </p>

              <h3 className="fw-bold mb-1">
                ₹18,810
              </h3>

              <small className="text-success">
                +12.5% from last month
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Available */}
        <CCol md={3} sm={6} className="mb-3">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Available Earnings
              </p>

              <h3 className="fw-bold mb-1">
                ₹12,450
              </h3>

              <small className="text-body-secondary">
                Ready for payout
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Pending */}
        <CCol md={3} sm={6} className="mb-3">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Pending Earnings
              </p>

              <h3 className="fw-bold mb-1">
                ₹6,360
              </h3>

              <small className="text-warning">
                Processing
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Commission */}
        <CCol md={3} sm={6} className="mb-3">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Platform Commission
              </p>

              <h3 className="fw-bold mb-1">
                ₹2,090
              </h3>

              <small className="text-body-secondary">
                This month
              </small>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>

    

      {/* Earnings Table */}
      <CCard className="border-0 shadow-sm">

        <CCardHeader className="bg-white py-3">
          <h5 className="fw-semibold mb-0">
            Recent Earnings
          </h5>
        </CCardHeader>

        <CCardBody className="p-0">

          <div className="table-responsive">

            <CTable hover align="middle" className="mb-0">

              <CTableHead>
                <CTableRow>

                  <CTableHeaderCell className="px-4">
                    Order ID
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Product
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Order Amount
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

                {earnings.map((item) => (

                  <CTableRow key={item.id}>

                    <CTableDataCell className="px-4">
                      <span className="fw-semibold">
                        {item.id}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.product}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.orderAmount}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.commission}
                    </CTableDataCell>

                    <CTableDataCell>
                      <span className="fw-semibold">
                        {item.earning}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge
                        color={
                          item.status === "Completed"
                            ? "success"
                            : "warning"
                        }
                      >
                        {item.status}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.date}
                    </CTableDataCell>

                  </CTableRow>

                ))}

              </CTableBody>

            </CTable>

          </div>

        </CCardBody>

      </CCard>

    </div>
  );
};

export default Earnings;