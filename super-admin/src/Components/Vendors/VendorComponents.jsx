import React, { useState } from "react";
import {
  CBadge,
  CButton,
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
import {
  cilCheckCircle,
  cilInfo,
  cilSearch,
  cilTrash,
  cilXCircle,
} from "@coreui/icons";

const Vendors = () => {
  const [vendors, setVendors] = useState([
    {
      id: "VEN-001",
      shopName: "Urban Store",
      ownerName: "Mohammad Rizwan",
      email: "vendor@gmail.com",
      phone: "+91 9876543210",
      location: "Indore, Madhya Pradesh",
      products: 48,
      orders: 126,
      earnings: "₹1,84,500",
      status: "Active",
      verification: "Verified",
      joined: "15 Aug 2026",
    },
    {
      id: "VEN-002",
      shopName: "Tech World",
      ownerName: "Aman Sharma",
      email: "aman@gmail.com",
      phone: "+91 9876543211",
      location: "Bhopal, Madhya Pradesh",
      products: 32,
      orders: 89,
      earnings: "₹1,25,800",
      status: "Active",
      verification: "Verified",
      joined: "18 Aug 2026",
    },
    {
      id: "VEN-003",
      shopName: "Fashion Hub",
      ownerName: "Priya Patel",
      email: "priya@gmail.com",
      phone: "+91 9876543212",
      location: "Mumbai, Maharashtra",
      products: 67,
      orders: 154,
      earnings: "₹2,45,600",
      status: "Active",
      verification: "Verified",
      joined: "20 Aug 2026",
    },
    {
      id: "VEN-004",
      shopName: "Sports Zone",
      ownerName: "Rahul Verma",
      email: "rahul@gmail.com",
      phone: "+91 9876543213",
      location: "Delhi, India",
      products: 24,
      orders: 51,
      earnings: "₹76,400",
      status: "Inactive",
      verification: "Verified",
      joined: "22 Aug 2026",
    },
    {
      id: "VEN-005",
      shopName: "Daily Essentials",
      ownerName: "Arjun Singh",
      email: "arjun@gmail.com",
      phone: "+91 9876543214",
      location: "Pune, Maharashtra",
      products: 15,
      orders: 27,
      earnings: "₹42,300",
      status: "Pending",
      verification: "Pending",
      joined: "30 Aug 2026",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");

  // ================= Status Change =================
  const handleStatusChange = (vendorId, newStatus) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, status: newStatus }
          : vendor
      )
    );
  };

  // ================= Verification =================
  const handleVerification = (vendorId, verification) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? {
              ...vendor,
              verification,
              status:
                verification === "Verified"
                  ? "Active"
                  : vendor.status,
            }
          : vendor
      )
    );
  };

  // ================= Delete =================
  const handleDelete = (vendorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this vendor?"
    );

    if (!confirmDelete) return;

    setVendors((prev) =>
      prev.filter((vendor) => vendor.id !== vendorId)
    );
  };

  // ================= Status Style =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return {
          backgroundColor: "#F3E8F1",
          color: "#70207B",
        };

      case "Pending":
        return {
          backgroundColor: "#FFF4FA",
          color: "#B83E91",
        };

      case "Inactive":
        return {
          backgroundColor: "#F5EEF3",
          color: "#7A6A76",
        };

      default:
        return {
          backgroundColor: "#F5EEF3",
          color: "#7A6A76",
        };
    }
  };

  // ================= Verification Style =================
  const getVerificationStyle = (verification) => {
    if (verification === "Verified") {
      return {
        backgroundColor: "#F3E8F1",
        color: "#70207B",
      };
    }

    return {
      backgroundColor: "#FFF4FA",
      color: "#B83E91",
    };
  };

  // ================= Filter Vendors =================
  const filteredVendors = vendors.filter((vendor) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      vendor.id.toLowerCase().includes(searchValue) ||
      vendor.shopName.toLowerCase().includes(searchValue) ||
      vendor.ownerName.toLowerCase().includes(searchValue) ||
      vendor.email.toLowerCase().includes(searchValue);

    const matchesStatus =
      !statusFilter || vendor.status === statusFilter;

    const matchesVerification =
      !verificationFilter ||
      vendor.verification === verificationFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesVerification
    );
  });

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* ================= Header ================= */}
      <div className="mb-4">
        <h3
          className="fw-semibold mb-1"
          style={{ color: "#111111" }}
        >
          Vendors
        </h3>

        <p
          className="mb-0"
          style={{ color: "#7A6A76" }}
        >
          Manage vendors, verification, shops and vendor activity
        </p>
      </div>

      {/* ================= Summary Cards ================= */}
      <CRow className="g-3 mb-4">
        <CCol sm={6} lg={3}>
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <small style={{ color: "#7A6A76" }}>
                Total Vendors
              </small>

              <h4
                className="fw-bold mt-2 mb-0"
                style={{ color: "#111111" }}
              >
                {vendors.length}
              </h4>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <small style={{ color: "#7A6A76" }}>
                Active Vendors
              </small>

              <h4
                className="fw-bold mt-2 mb-0"
                style={{ color: "#70207B" }}
              >
                {
                  vendors.filter(
                    (vendor) => vendor.status === "Active"
                  ).length
                }
              </h4>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <small style={{ color: "#7A6A76" }}>
                Pending Verification
              </small>

              <h4
                className="fw-bold mt-2 mb-0"
                style={{ color: "#B83E91" }}
              >
                {
                  vendors.filter(
                    (vendor) =>
                      vendor.verification === "Pending"
                  ).length
                }
              </h4>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard
            className="h-100 shadow-sm"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
            }}
          >
            <CCardBody>
              <small style={{ color: "#7A6A76" }}>
                Total Products
              </small>

              <h4
                className="fw-bold mt-2 mb-0"
                style={{ color: "#8B2595" }}
              >
                {vendors.reduce(
                  (total, vendor) =>
                    total + vendor.products,
                  0
                )}
              </h4>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ================= Filters ================= */}
      <CCard
        className="shadow-sm mb-4"
        style={{
          backgroundColor: "#FFF4FA",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
        }}
      >
        <CCardBody>
          <CRow className="g-3">
            {/* Search */}
            <CCol md={6}>
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vendor, shop, email..."
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

            {/* Status */}
            <CCol md={3}>
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
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </CFormSelect>
            </CCol>

            {/* Verification */}
            <CCol md={3}>
              <CFormSelect
                value={verificationFilter}
                onChange={(e) =>
                  setVerificationFilter(e.target.value)
                }
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              >
                <option value="">All Verification</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= Vendors Table ================= */}
      <CCard
        className="shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6C5DE",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CCardHeader
          className="px-4 py-3"
          style={{
            backgroundColor: "#FFF4FA",
            borderBottom: "1px solid #E6C5DE",
          }}
        >
          <h5
            className="fw-semibold mb-1"
            style={{ color: "#111111" }}
          >
            All Vendors
          </h5>

          <small style={{ color: "#7A6A76" }}>
            {filteredVendors.length} vendors found
          </small>
        </CCardHeader>

        <CCardBody className="p-0">
          <div style={{ overflowX: "auto" }}>
            <CTable
              hover
              align="middle"
              className="mb-0"
              style={{
                minWidth: "1350px",
              }}
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    className="ps-4"
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Vendor
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Contact
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Location
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Products
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Orders
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Earnings
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    style={{
                      backgroundColor: "#FFF4FA",
                      color: "#111111",
                      borderBottom: "1px solid #E6C5DE",
                    }}
                  >
                    Verification
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
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <CTableRow key={vendor.id}>
                      {/* Vendor */}
                      <CTableDataCell
                        className="ps-4"
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <div
                          className="fw-semibold"
                          style={{ color: "#111111" }}
                        >
                          {vendor.shopName}
                        </div>

                        <small
                          style={{
                            color: "#B83E91",
                          }}
                        >
                          {vendor.id}
                        </small>

                        <div
                          className="small"
                          style={{ color: "#7A6A76" }}
                        >
                          {vendor.ownerName}
                        </div>
                      </CTableDataCell>

                      {/* Contact */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <div style={{ color: "#111111" }}>
                          {vendor.email}
                        </div>

                        <small style={{ color: "#7A6A76" }}>
                          {vendor.phone}
                        </small>
                      </CTableDataCell>

                      {/* Location */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                          color: "#7A6A76",
                        }}
                      >
                        {vendor.location}
                      </CTableDataCell>

                      {/* Products */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                          color: "#111111",
                          fontWeight: 600,
                        }}
                      >
                        {vendor.products}
                      </CTableDataCell>

                      {/* Orders */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                          color: "#111111",
                          fontWeight: 600,
                        }}
                      >
                        {vendor.orders}
                      </CTableDataCell>

                      {/* Earnings */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                          color: "#111111",
                          fontWeight: 600,
                        }}
                      >
                        {vendor.earnings}
                      </CTableDataCell>

                      {/* Verification */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <CBadge
                          style={{
                            ...getVerificationStyle(
                              vendor.verification
                            ),
                            padding: "7px 12px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          {vendor.verification}
                        </CBadge>
                      </CTableDataCell>

                      {/* Status */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <CFormSelect
                          size="sm"
                          value={vendor.status}
                          onChange={(e) =>
                            handleStatusChange(
                              vendor.id,
                              e.target.value
                            )
                          }
                          style={{
                            width: "115px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E6C5DE",
                            borderRadius: "7px",
                            color: "#111111",
                          }}
                        >
                          <option value="Active">
                            Active
                          </option>
                          <option value="Inactive">
                            Inactive
                          </option>
                          <option value="Pending">
                            Pending
                          </option>
                        </CFormSelect>
                      </CTableDataCell>

                      {/* Actions */}
                      <CTableDataCell
                        style={{
                          borderBottom: "1px solid #F0DCE9",
                        }}
                      >
                        <div className="d-flex gap-2">
                          {vendor.verification === "Pending" && (
                            <>
                              <CButton
                                size="sm"
                                title="Approve Vendor"
                                onClick={() =>
                                  handleVerification(
                                    vendor.id,
                                    "Verified"
                                  )
                                }
                                style={{
                                  backgroundColor: "#F3E8F1",
                                  color: "#70207B",
                                  border: "1px solid #E6C5DE",
                                  borderRadius: "7px",
                                }}
                              >
                                <CIcon icon={cilCheckCircle} />
                              </CButton>

                              <CButton
                                size="sm"
                                title="Reject Vendor"
                                onClick={() =>
                                  handleVerification(
                                    vendor.id,
                                    "Rejected"
                                  )
                                }
                                style={{
                                  backgroundColor: "#F5EEF3",
                                  color: "#7A6A76",
                                  border: "1px solid #E6C5DE",
                                  borderRadius: "7px",
                                }}
                              >
                                <CIcon icon={cilXCircle} />
                              </CButton>
                            </>
                          )}

                          <CButton
                            size="sm"
                            title="Vendor Details"
                            style={{
                              backgroundColor: "#FFF4FA",
                              color: "#B83E91",
                              border: "1px solid #E6C5DE",
                              borderRadius: "7px",
                            }}
                          >
                            <CIcon icon={cilInfo} />
                          </CButton>

                          <CButton
                            size="sm"
                            title="Delete Vendor"
                            onClick={() =>
                              handleDelete(vendor.id)
                            }
                            style={{
                              backgroundColor: "#F5EEF3",
                              color: "#7A6A76",
                              border: "1px solid #E6C5DE",
                              borderRadius: "7px",
                            }}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={9}
                      className="text-center py-5"
                    >
                      <div
                        className="fw-semibold"
                        style={{ color: "#111111" }}
                      >
                        No vendors found
                      </div>

                      <small style={{ color: "#7A6A76" }}>
                        Try changing your search or filters.
                      </small>
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

export default Vendors;

