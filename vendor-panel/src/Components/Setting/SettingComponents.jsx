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
  CRow,
} from "@coreui/react";

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: "Meera Plastic Center",
    logo: "",
    email: "contact@meerastore.com",
    phone: "+91 9876543210",
    footerText: "© 2026 Meera Plastic Center. All rights reserved.",
  });

  const [editMode, setEditMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setSettings({
        ...settings,
        logo: file,
      });
    }
  };

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <CContainer fluid className="py-3">
      <CRow className="mb-4">
        <CCol>
          <h3 className="fw-bold mb-1">Website Settings</h3>
          <p className="text-body-secondary mb-0">
            Manage your website information and branding.
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
              <div className="mb-3">
                <CFormLabel>Website Logo</CFormLabel>

                {(logoPreview || (typeof settings.logo === "string" && settings.logo)) && (
                  <div className="mb-2">
                    <img
                      src={logoPreview || settings.logo}
                      alt="Website Logo"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={!editMode}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Website Name</CFormLabel>
                <CFormInput
                  name="websiteName"
                  value={settings.websiteName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

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

              <div className="mb-3">
                <CFormLabel>Contact Phone</CFormLabel>
                <CFormInput
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Footer Copyright Text</CFormLabel>
                <CFormInput
                  name="footerText"
                  value={settings.footerText}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

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
