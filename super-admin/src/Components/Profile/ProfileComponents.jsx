import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CButton,
} from "@coreui/react";

const VendorProfile = () => {
  const [formData, setFormData] = useState({
    shopName: "Urban Store",
    ownerName: "Mohammad Rizwan",
    email: "vendor@gmail.com",
    phone: "+91 9876543210",
    address: "Indore, Madhya Pradesh, India",
    description:
      "We provide quality products at affordable prices for our customers.",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <CContainer
      fluid
      className="py-3"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* ================= Page Header ================= */}
      <CRow className="mb-4">
        <CCol>
          <h3
            className="fw-semibold mb-1"
            style={{ color: "#111111" }}
          >
            Vendor Profile
          </h3>

          <p
            className="mb-0"
            style={{ color: "#7A6A76" }}
          >
            Manage your vendor information
          </p>
        </CCol>
      </CRow>

      {/* ================= Profile Card ================= */}
      <CRow>
        <CCol xs={12}>
          <CCard
            className="shadow-sm"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6C5DE",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Card Header */}
            <CCardHeader
              className="px-4 py-3"
              style={{
                backgroundColor: "#FFF4FA",
                borderBottom: "1px solid #E6C5DE",
              }}
            >
              <h5
                className="mb-0 fw-semibold"
                style={{ color: "#111111" }}
              >
                Profile Information
              </h5>
            </CCardHeader>

            <CCardBody className="p-4">
              {/* ================= Profile Photo ================= */}
              <div className="mb-4">
                <CFormLabel
                  className="fw-semibold"
                  style={{ color: "#111111" }}
                >
                  Profile Photo
                </CFormLabel>

                <div className="d-flex align-items-center gap-3 mt-2">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Vendor"
                    width="80"
                    height="80"
                    style={{
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "2px solid #E6C5DE",
                    }}
                  />

                  {editMode && (
                    <CButton
                      variant="outline"
                      style={{
                        borderColor: "#E6C5DE",
                        color: "#B83E91",
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Change Photo
                    </CButton>
                  )}
                </div>
              </div>

              {/* ================= Form ================= */}
              <CRow className="g-3">
                {/* Shop Name */}
                <CCol md={6}>
                  <CFormLabel
                    className="fw-semibold"
                    style={{ color: "#111111" }}
                  >
                    Shop Name
                  </CFormLabel>

                  <CFormInput
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{
                      backgroundColor: editMode
                        ? "#FFFFFF"
                        : "#FFF4FA",
                      border: "1px solid #E6C5DE",
                      borderRadius: "8px",
                      color: "#111111",
                    }}
                  />
                </CCol>

                {/* Owner Name */}
                <CCol md={6}>
                  <CFormLabel
                    className="fw-semibold"
                    style={{ color: "#111111" }}
                  >
                    Owner Name
                  </CFormLabel>

                  <CFormInput
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{
                      backgroundColor: editMode
                        ? "#FFFFFF"
                        : "#FFF4FA",
                      border: "1px solid #E6C5DE",
                      borderRadius: "8px",
                      color: "#111111",
                    }}
                  />
                </CCol>

                {/* Email */}
                <CCol md={6}>
                  <CFormLabel
                    className="fw-semibold"
                    style={{ color: "#111111" }}
                  >
                    Email
                  </CFormLabel>

                  <CFormInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{
                      backgroundColor: editMode
                        ? "#FFFFFF"
                        : "#FFF4FA",
                      border: "1px solid #E6C5DE",
                      borderRadius: "8px",
                      color: "#111111",
                    }}
                  />
                </CCol>

                {/* Phone */}
                <CCol md={6}>
                  <CFormLabel
                    className="fw-semibold"
                    style={{ color: "#111111" }}
                  >
                    Phone
                  </CFormLabel>

                  <CFormInput
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{
                      backgroundColor: editMode
                        ? "#FFFFFF"
                        : "#FFF4FA",
                      border: "1px solid #E6C5DE",
                      borderRadius: "8px",
                      color: "#111111",
                    }}
                  />
                </CCol>

                {/* Address */}
                <CCol xs={12}>
                  <CFormLabel
                    className="fw-semibold"
                    style={{ color: "#111111" }}
                  >
                    Shop Address
                  </CFormLabel>

                  <CFormInput
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{
                      backgroundColor: editMode
                        ? "#FFFFFF"
                        : "#FFF4FA",
                      border: "1px solid #E6C5DE",
                      borderRadius: "8px",
                      color: "#111111",
                    }}
                  />
                </CCol>

                {/* Description */}
                <CCol xs={12}>
                  <CFormLabel
                    className="fw-semibold"
                    style={{ color: "#111111" }}
                  >
                    Business Description
                  </CFormLabel>

                  <CFormTextarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{
                      backgroundColor: editMode
                        ? "#FFFFFF"
                        : "#FFF4FA",
                      border: "1px solid #E6C5DE",
                      borderRadius: "8px",
                      color: "#111111",
                      resize: "vertical",
                    }}
                  />
                </CCol>
              </CRow>

              {/* ================= Buttons ================= */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                {editMode ? (
                  <>
                    <CButton
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      style={{
                        borderColor: "#E6C5DE",
                        color: "#7A6A76",
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </CButton>

                    <CButton
                      onClick={handleSave}
                      className="border-0"
                      style={{
                        backgroundColor: "#B83E91",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        fontWeight: 600,
                        padding: "9px 18px",
                      }}
                    >
                      Save Changes
                    </CButton>
                  </>
                ) : (
                  <CButton
                    onClick={() => setEditMode(true)}
                    className="border-0"
                    style={{
                      backgroundColor: "#B83E91",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontWeight: 600,
                      padding: "9px 18px",
                    }}
                  >
                    Edit Profile
                  </CButton>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default VendorProfile;
