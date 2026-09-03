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
  const getStatusStyle = (status) => {
    if (status === "Active") {
      return { backgroundColor: "#F3E8F1", color: "#70207B" };
    }
    return { backgroundColor: "#F5EEF3", color: "#7A6A76" };
  };
  return (
    <div className="w-full overflow-hidden">
      {" "}
      <CTable hover responsive align="middle" className="mb-0 !text-[#111111]">
        {" "}
        {/* ================= TABLE HEAD ================= */}{" "}
        <CTableHead>
          {" "}
          <CTableRow className="!bg-[#FFF4FA]">
            {" "}
            <CTableHeaderCell className=" !text-[#7A6A76] !font-semibold !text-xs !uppercase !tracking-wide !border-b !border-[#E6C5DE] !py-4 ">
              {" "}
              Customer{" "}
            </CTableHeaderCell>{" "}
            <CTableHeaderCell className=" !text-[#7A6A76] !font-semibold !text-xs !uppercase !tracking-wide !border-b !border-[#E6C5DE] !py-4 ">
              {" "}
              Orders{" "}
            </CTableHeaderCell>{" "}
            <CTableHeaderCell className=" !text-[#7A6A76] !font-semibold !text-xs !uppercase !tracking-wide !border-b !border-[#E6C5DE] !py-4 ">
              {" "}
              Total Spent{" "}
            </CTableHeaderCell>{" "}
            <CTableHeaderCell className=" !text-[#7A6A76] !font-semibold !text-xs !uppercase !tracking-wide !border-b !border-[#E6C5DE] !py-4 ">
              {" "}
              Status{" "}
            </CTableHeaderCell>{" "}
            <CTableHeaderCell className=" !text-[#7A6A76] !font-semibold !text-xs !uppercase !tracking-wide !border-b !border-[#E6C5DE] !py-4 ">
              {" "}
              Joined{" "}
            </CTableHeaderCell>{" "}
          </CTableRow>{" "}
        </CTableHead>{" "}
        {/* ================= TABLE BODY ================= */}{" "}
        <CTableBody>
          {" "}
          {customers.map((customer) => (
            <CTableRow
              key={customer.id}
              className=" hover:!bg-[#FFF4FA] transition duration-150 "
            >
              {" "}
              {/* Customer */}{" "}
              <CTableDataCell className=" !border-b !border-[#F0DCE9] !py-4 ">
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <CAvatar
                    size="md"
                    className=" !bg-[#B83E91] !text-white !font-semibold !border-2 !border-[#E6C5DE] "
                  >
                    {" "}
                    {customer.name.charAt(0)}{" "}
                  </CAvatar>{" "}
                  <div>
                    {" "}
                    <div className="font-semibold text-[#111111]">
                      {" "}
                      {customer.name}{" "}
                    </div>{" "}
                    <small className="text-[#7A6A76]">
                      {" "}
                      {customer.email}{" "}
                    </small>{" "}
                  </div>{" "}
                </div>{" "}
              </CTableDataCell>{" "}
              {/* Orders */}{" "}
              <CTableDataCell className=" !border-b !border-[#F0DCE9] !py-4 ">
                {" "}
                <span className="font-semibold text-[#111111]">
                  {" "}
                  {customer.orders}{" "}
                </span>{" "}
              </CTableDataCell>{" "}
              {/* Total Spent */}{" "}
              <CTableDataCell className=" !border-b !border-[#F0DCE9] !py-4 ">
                {" "}
                <span className="font-bold text-[#111111]">
                  {" "}
                  {customer.spent}{" "}
                </span>{" "}
              </CTableDataCell>{" "}
              {/* Status */}{" "}
              <CTableDataCell className=" !border-b !border-[#F0DCE9] !py-4 ">
                {" "}
                <CBadge
                  shape="rounded-pill"
                  className=" !px-3 !py-2 !font-semibold !text-xs !border-0 "
                  style={getStatusStyle(customer.status)}
                >
                  {" "}
                  {customer.status}{" "}
                </CBadge>{" "}
              </CTableDataCell>{" "}
              {/* Joined */}{" "}
              <CTableDataCell className=" !border-b !border-[#F0DCE9] !py-4 ">
                {" "}
                <span className="text-[#7A6A76]"> {customer.joined} </span>{" "}
              </CTableDataCell>{" "}
            </CTableRow>
          ))}{" "}
        </CTableBody>{" "}
      </CTable>{" "}
    </div>
  );
};
export default RecentCustomers;
