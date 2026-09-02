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
      message.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CContainer fluid className="py-3">
      <CRow className="mb-4">
        <CCol>
          <h3 className="fw-bold mb-1">Messages</h3>
          <p className="text-body-secondary mb-0">
            View messages received from customers
          </p>
        </CCol>
      </CRow>

      <CRow>
        {/* Messages List */}
        <CCol lg={7} className="mb-4">
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center gap-3">
                <h5 className="mb-0">Messages</h5>

                <CFormInput
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "250px" }}
                />
              </div>
            </CCardHeader>

            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-3">
                      Sender
                    </CTableHeaderCell>
                    <CTableHeaderCell>Subject</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredMessages.map((message) => (
                    <CTableRow
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      style={{ cursor: "pointer" }}
                    >
                      <CTableDataCell className="ps-3">
                        <div className="fw-semibold">{message.name}</div>
                        <small className="text-body-secondary">
                          {message.email}
                        </small>
                      </CTableDataCell>

                      <CTableDataCell>
                        {message.subject}
                      </CTableDataCell>

                      <CTableDataCell>
                        {message.date}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Message Details */}
        <CCol lg={5}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Message Details</h5>
            </CCardHeader>

            <CCardBody>
              {selectedMessage ? (
                <>
                  <div className="mb-3">
                    <small className="text-body-secondary">From</small>
                    <div className="fw-semibold">
                      {selectedMessage.name}
                    </div>
                    <div className="text-body-secondary">
                      {selectedMessage.email}
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-body-secondary">Subject</small>
                    <div className="fw-semibold">
                      {selectedMessage.subject}
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-body-secondary">
                      Received
                    </small>
                    <div>
                      {selectedMessage.date} at {selectedMessage.time}
                    </div>
                  </div>

                  <hr />

                  <div>
                    <small className="text-body-secondary">Message</small>
                    <p
                      className="mt-2 mb-0"
                      style={{ lineHeight: "1.7" }}
                    >
                      {selectedMessage.message}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-body-secondary py-5">
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