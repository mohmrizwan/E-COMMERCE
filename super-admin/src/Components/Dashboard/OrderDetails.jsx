import React from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

const RecentOrders = () => {
  const orders = [
    {
      id: "#ORD001",
      customer: "Mohammad Rizwan",
      product: "Nike Air Max",
      amount: "₹4,999",
      status: "Delivered",
      date: "01 Sep 2026",
    },
    {
      id: "#ORD002",
      customer: "Aman Sharma",
      product: "iPhone Case",
      amount: "₹899",
      status: "Pending",
      date: "01 Sep 2026",
    },
    {
      id: "#ORD003",
      customer: "Rahul Verma",
      product: "Adidas Shoes",
      amount: "₹3,499",
      status: "Shipped",
      date: "31 Aug 2026",
    },
    {
      id: "#ORD004",
      customer: "Arjun Singh",
      product: "Smart Watch",
      amount: "₹2,999",
      status: "Processing",
      date: "31 Aug 2026",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#F3E8F1",
          color: "#70207B",
        };

      case "Pending":
        return {
          backgroundColor: "#FFF4FA",
          color: "#B83E91",
        };

      case "Shipped":
        return {
          backgroundColor: "#F1E8F5",
          color: "#8B2595",
        };

      case "Processing":
        return {
          backgroundColor: "#F8E9F5",
          color: "#B3398A",
        };

      default:
        return {
          backgroundColor: "#F5F5F5",
          color: "#7A6A76",
        };
    }
  };

  return (
    <div className="w-full overflow-hidden">

      <CTable
        hover
        responsive
        align="middle"
        className="mb-0 !text-[#111111]"
      >
        {/* ================= TABLE HEAD ================= */}

        <CTableHead>
          <CTableRow className="!bg-[#FFF4FA]">

            <CTableHeaderCell
              className="
                !text-[#7A6A76]
                !font-semibold
                !text-xs
                !uppercase
                !tracking-wide
                !border-b
                !border-[#E6C5DE]
                !py-4
              "
            >
              Order ID
            </CTableHeaderCell>

            <CTableHeaderCell
              className="
                !text-[#7A6A76]
                !font-semibold
                !text-xs
                !uppercase
                !tracking-wide
                !border-b
                !border-[#E6C5DE]
                !py-4
              "
            >
              Customer
            </CTableHeaderCell>

            <CTableHeaderCell
              className="
                !text-[#7A6A76]
                !font-semibold
                !text-xs
                !uppercase
                !tracking-wide
                !border-b
                !border-[#E6C5DE]
                !py-4
              "
            >
              Product
            </CTableHeaderCell>

            <CTableHeaderCell
              className="
                !text-[#7A6A76]
                !font-semibold
                !text-xs
                !uppercase
                !tracking-wide
                !border-b
                !border-[#E6C5DE]
                !py-4
              "
            >
              Amount
            </CTableHeaderCell>

            <CTableHeaderCell
              className="
                !text-[#7A6A76]
                !font-semibold
                !text-xs
                !uppercase
                !tracking-wide
                !border-b
                !border-[#E6C5DE]
                !py-4
              "
            >
              Status
            </CTableHeaderCell>

            <CTableHeaderCell
              className="
                !text-[#7A6A76]
                !font-semibold
                !text-xs
                !uppercase
                !tracking-wide
                !border-b
                !border-[#E6C5DE]
                !py-4
              "
            >
              Date
            </CTableHeaderCell>

          </CTableRow>
        </CTableHead>

        {/* ================= TABLE BODY ================= */}

        <CTableBody>

          {orders.map((order) => (
            <CTableRow
              key={order.id}
              className="
                hover:!bg-[#FFF4FA]
                transition
                duration-150
              "
            >

              {/* Order ID */}

              <CTableDataCell
                className="
                  !border-b
                  !border-[#F0DCE9]
                  !py-4
                "
              >
                <span
                  className="
                    font-semibold
                    text-[#B83E91]
                  "
                >
                  {order.id}
                </span>
              </CTableDataCell>

              {/* Customer */}

              <CTableDataCell
                className="
                  !border-b
                  !border-[#F0DCE9]
                  !py-4
                "
              >
                <div className="font-semibold text-[#111111]">
                  {order.customer}
                </div>

                <small className="text-[#7A6A76]">
                  Customer
                </small>
              </CTableDataCell>

              {/* Product */}

              <CTableDataCell
                className="
                  !border-b
                  !border-[#F0DCE9]
                  !py-4
                  !text-[#111111]
                "
              >
                {order.product}
              </CTableDataCell>

              {/* Amount */}

              <CTableDataCell
                className="
                  !border-b
                  !border-[#F0DCE9]
                  !py-4
                "
              >
                <span className="font-bold text-[#111111]">
                  {order.amount}
                </span>
              </CTableDataCell>

              {/* Status */}

              <CTableDataCell
                className="
                  !border-b
                  !border-[#F0DCE9]
                  !py-4
                "
              >
                <CBadge
                  shape="rounded-pill"
                  className="
                    !px-3
                    !py-2
                    !font-semibold
                    !text-xs
                    !border-0
                  "
                  style={getStatusStyle(order.status)}
                >
                  {order.status}
                </CBadge>
              </CTableDataCell>

              {/* Date */}

              <CTableDataCell
                className="
                  !border-b
                  !border-[#F0DCE9]
                  !py-4
                "
              >
                <span className="text-[#7A6A76]">
                  {order.date}
                </span>
              </CTableDataCell>

            </CTableRow>
          ))}

        </CTableBody>
      </CTable>

    </div>
  );
};

export default RecentOrders;

