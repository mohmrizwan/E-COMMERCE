import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from "@coreui/react";

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: "Urban Store",
    websiteUrl: "urbanstore.com",
    email: "contact@urbanstore.com",
    phone: "+91 9876543210",
    currency: "INR",
    language: "English",
    description:
      "Welcome to Urban Store. We provide quality products at affordable prices.",
    footerText: "© 2026 Urban Store. All rights reserved.",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <CContainer fluid className="py-3">
      {/* Header */}
      <CRow className="mb-4">
        <CCol>
          <h3 className="fw-bold mb-1">Website Settings</h3>
          <p className="text-body-secondary mb-0">
            Manage your website information and settings
          </p>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">General Settings</h5>
            </CCardHeader>

            <CCardBody>
              {/* Website Name */}
              <div className="mb-3">
                <CFormLabel>Website Name</CFormLabel>
                <CFormInput
                  name="websiteName"
                  value={settings.websiteName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Website URL */}
              <div className="mb-3">
                <CFormLabel>Website URL</CFormLabel>
                <CFormInput
                  name="websiteUrl"
                  value={settings.websiteUrl}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <CFormLabel>Contact Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <CFormLabel>Contact Phone</CFormLabel>
                <CFormInput
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Currency */}
              <div className="mb-3">
                <CFormLabel>Currency</CFormLabel>
                <CFormSelect
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </CFormSelect>
              </div>

              {/* Language */}
              <div className="mb-3">
                <CFormLabel>Language</CFormLabel>
                <CFormSelect
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </CFormSelect>
              </div>

              {/* Website Description */}
              <div className="mb-3">
                <CFormLabel>Website Description</CFormLabel>
                <CFormTextarea
                  rows={4}
                  name="description"
                  value={settings.description}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              {/* Footer */}
              <div className="mb-3">
                <CFormLabel>Footer Text</CFormLabel>
                <CFormInput
                  name="footerText"
                  value={settings.footerText}
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
                    Edit Settings
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

export default WebsiteSettings;