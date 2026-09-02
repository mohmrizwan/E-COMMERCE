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
    <CContainer fluid className="py-3">
      {/* Page Header */}
      <CRow className="mb-4">
        <CCol>
          <h3 className="fw-bold mb-1">Vendor Profile</h3>
          <p className="text-body-secondary mb-0">
            Manage your vendor information
          </p>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Profile Information</h5>
            </CCardHeader>

            <CCardBody>
              {/* Profile Photo */}
              <div className="mb-4">
                <CFormLabel>Profile Photo</CFormLabel>

                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Vendor"
                    width="80"
                    height="80"
                    className="rounded"
                  />

                  {editMode && (
                    <CButton color="secondary" variant="outline">
                      Change Photo
                    </CButton>
                  )}
                </div>
              </div>

              {/* Shop Name */}
              <div className="mb-3">
                <CFormLabel>Shop Name</CFormLabel>
                <CFormInput
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Owner Name */}
              <div className="mb-3">
                <CFormLabel>Owner Name</CFormLabel>
                <CFormInput
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <CFormLabel>Phone</CFormLabel>
                <CFormInput
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <CFormLabel>Shop Address</CFormLabel>
                <CFormInput
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <CFormLabel>Business Description</CFormLabel>
                <CFormTextarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                {editMode ? (
                  <>
                    <CButton
                      color="secondary"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </CButton>

                    <CButton color="primary" onClick={handleSave}>
                      Save Changes
                    </CButton>
                  </>
                ) : (
                  <CButton
                    color="primary"
                    onClick={() => setEditMode(true)}
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