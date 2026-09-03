import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

const Messages = () => {
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahulsharma@gmail.com",
      subject: "Order Issue",
      message:
        "Hello, I wanted to know the status of my recent order. Please let me know when my order will be delivered.",
      date: "02 Sep 2026",
      time: "10:30 AM",
    },
    {
      id: 2,
      name: "Aman Verma",
      email: "amanverma@gmail.com",
      subject: "Product Inquiry",
      message:
        "Hi, I am interested in one of the products available on your website. Could you please provide me with more information?",
      date: "01 Sep 2026",
      time: "04:15 PM",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priyasingh@gmail.com",
      subject: "Payment Problem",
      message:
        "Hello, I tried to make a payment for my order but the payment failed. Please help me with this issue.",
      date: "31 Aug 2026",
      time: "01:20 PM",
    },
    {
      id: 4,
      name: "Arjun Mehta",
      email: "arjunmehta@gmail.com",
      subject: "Return Request",
      message:
        "I would like to return the product I received. Please let me know the return process.",
      date: "30 Aug 2026",
      time: "11:45 AM",
    },
  ];

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(search.toLowerCase()) ||
      message.subject.toLowerCase().includes(search.toLowerCase()) ||
      message.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <CContainer
      fluid
      className="py-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* Page Header */}
      <CRow className="mb-4">
        <CCol>
          <h3
            className="fw-bold mb-1"
            style={{ color: "#111111" }}
          >
            Messages
          </h3>

          <p
            className="mb-0"
            style={{ color: "#7A6A76" }}
          >
            View messages received from customers
          </p>
        </CCol>
      </CRow>

      <CRow>
        {/* Messages List */}
        <CCol lg={7} className="mb-4">
          <CCard
            className="shadow-sm h-100"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <CCardHeader
              className="py-3"
              style={{
                backgroundColor: "#FFF4FA",
                borderBottom: "1px solid #E6C5DE",
              }}
            >
              <div className="d-flex justify-content-between align-items-center gap-3">
                <h5
                  className="mb-0 fw-semibold"
                  style={{ color: "#111111" }}
                >
                  Messages
                </h5>

                <CFormInput
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    maxWidth: "250px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6C5DE",
                    borderRadius: "8px",
                    color: "#111111",
                  }}
                />
              </div>
            </CCardHeader>

            <CCardBody className="p-0">
              <div className="table-responsive">
                <CTable
                  hover
                  responsive
                  align="middle"
                  className="mb-0"
                  style={{
                    minWidth: "600px",
                  }}
                >
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell
                        className="ps-3 py-3"
                        style={{
                          backgroundColor: "#FFF4FA",
                          color: "#111111",
                          borderBottom: "1px solid #E6C5DE",
                        }}
                      >
                        Sender
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        style={{
                          backgroundColor: "#FFF4FA",
                          color: "#111111",
                          borderBottom: "1px solid #E6C5DE",
                        }}
                      >
                        Subject
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
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((message) => (
                        <CTableRow
                          key={message.id}
                          onClick={() => setSelectedMessage(message)}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedMessage?.id === message.id
                                ? "#FFF4FA"
                                : "#FFFFFF",
                          }}
                        >
                          <CTableDataCell
                            className="ps-3 py-3"
                            style={{
                              borderBottom: "1px solid #F0DCE9",
                            }}
                          >
                            <div
                              className="fw-semibold"
                              style={{ color: "#111111" }}
                            >
                              {message.name}
                            </div>

                            <small style={{ color: "#7A6A76" }}>
                              {message.email}
                            </small>
                          </CTableDataCell>

                          <CTableDataCell
                            style={{
                              color: "#B83E91",
                              fontWeight: 500,
                              borderBottom: "1px solid #F0DCE9",
                            }}
                          >
                            {message.subject}
                          </CTableDataCell>

                          <CTableDataCell
                            style={{
                              color: "#7A6A76",
                              borderBottom: "1px solid #F0DCE9",
                            }}
                          >
                            {message.date}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan={3}
                          className="text-center py-5"
                          style={{
                            color: "#7A6A76",
                          }}
                        >
                          No messages found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Message Details */}
        <CCol lg={5}>
          <CCard
            className="shadow-sm h-100"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <CCardHeader
              className="py-3"
              style={{
                backgroundColor: "#FFF4FA",
                borderBottom: "1px solid #E6C5DE",
              }}
            >
              <h5
                className="mb-0 fw-semibold"
                style={{ color: "#111111" }}
              >
                Message Details
              </h5>
            </CCardHeader>

            <CCardBody>
              {selectedMessage ? (
                <>
                  {/* Sender */}
                  <div className="mb-4">
                    <small
                      className="d-block mb-1"
                      style={{ color: "#7A6A76" }}
                    >
                      From
                    </small>

                    <div
                      className="fw-semibold"
                      style={{ color: "#111111" }}
                    >
                      {selectedMessage.name}
                    </div>

                    <div style={{ color: "#7A6A76" }}>
                      {selectedMessage.email}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <small
                      className="d-block mb-1"
                      style={{ color: "#7A6A76" }}
                    >
                      Subject
                    </small>

                    <div
                      className="fw-semibold"
                      style={{ color: "#B83E91" }}
                    >
                      {selectedMessage.subject}
                    </div>
                  </div>

                  {/* Received */}
                  <div className="mb-4">
                    <small
                      className="d-block mb-1"
                      style={{ color: "#7A6A76" }}
                    >
                      Received
                    </small>

                    <div style={{ color: "#111111" }}>
                      {selectedMessage.date} at{" "}
                      {selectedMessage.time}
                    </div>
                  </div>

                  <hr
                    style={{
                      borderColor: "#E6C5DE",
                      opacity: 1,
                    }}
                  />

                  {/* Message */}
                  <div className="mt-4">
                    <small
                      className="d-block mb-1"
                      style={{ color: "#7A6A76" }}
                    >
                      Message
                    </small>

                    <p
                      className="mt-2 mb-0"
                      style={{
                        color: "#111111",
                        lineHeight: "1.7",
                      }}
                    >
                      {selectedMessage.message}
                    </p>
                  </div>
                </>
              ) : (
                <div
                  className="text-center py-5"
                  style={{ color: "#7A6A76" }}
                >
                  Select a message to view details
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Messages;

