import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from "@coreui/react";

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    // Website
    websiteName: "Urban Store",
    websiteUrl: "urbanstore.com",
    email: "contact@urbanstore.com",
    phone: "+91 9876543210",
    description:
      "Welcome to Urban Store. We provide quality products at affordable prices.",
    footerText: "© 2026 Urban Store. All rights reserved.",

    // Localization
    currency: "INR",
    language: "English",
    timezone: "Asia/Kolkata",

    // Store
    orderStatus: "Active",
    maintenanceMode: false,
    allowGuestCheckout: true,
    allowVendorRegistration: true,

    // Shipping & Tax
    shippingCharge: "99",
    freeShippingAbove: "999",
    taxEnabled: true,
    taxRate: "18",

    // SEO
    metaTitle: "Urban Store - Online Shopping",
    metaDescription:
      "Shop quality products at affordable prices at Urban Store.",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    setEditMode(false);

    // Backend API baad mein yahan connect karenge
    console.log("Website Settings:", settings);
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
            Website Settings
          </h3>

          <p
            className="mb-0"
            style={{ color: "#7A6A76" }}
          >
            Manage your website, store, checkout and system settings
          </p>
        </CCol>
      </CRow>

      {/* ================= General Settings ================= */}
      <CCard
        className="shadow-sm mb-4"
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
            className="mb-1 fw-semibold"
            style={{ color: "#111111" }}
          >
            General Settings
          </h5>

          <small style={{ color: "#7A6A76" }}>
            Manage your website identity and contact information
          </small>
        </CCardHeader>

        <CCardBody className="p-4">
          <CRow className="g-3">
            {/* Website Name */}
            <CCol md={6}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Website Name
              </CFormLabel>

              <CFormInput
                name="websiteName"
                value={settings.websiteName}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>

            {/* Website URL */}
            <CCol md={6}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Website URL
              </CFormLabel>

              <CFormInput
                name="websiteUrl"
                value={settings.websiteUrl}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
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
                Contact Email
              </CFormLabel>

              <CFormInput
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
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
                Contact Phone
              </CFormLabel>

              <CFormInput
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
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
                Website Description
              </CFormLabel>

              <CFormTextarea
                rows={3}
                name="description"
                value={settings.description}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>

            {/* Footer */}
            <CCol xs={12}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Footer Text
              </CFormLabel>

              <CFormInput
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= Localization ================= */}
      <CCard
        className="shadow-sm mb-4"
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
            className="mb-1 fw-semibold"
            style={{ color: "#111111" }}
          >
            Localization
          </h5>

          <small style={{ color: "#7A6A76" }}>
            Configure currency, language and timezone
          </small>
        </CCardHeader>

        <CCardBody className="p-4">
          <CRow className="g-3">
            {/* Currency */}
            <CCol md={4}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Currency
              </CFormLabel>

              <CFormSelect
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </CFormSelect>
            </CCol>

            {/* Language */}
            <CCol md={4}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Language
              </CFormLabel>

              <CFormSelect
                name="language"
                value={settings.language}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </CFormSelect>
            </CCol>

            {/* Timezone */}
            <CCol md={4}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Timezone
              </CFormLabel>

              <CFormSelect
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              >
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">
                  New York (EST)
                </option>
                <option value="Europe/London">
                  London (GMT)
                </option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= Store Settings ================= */}
      <CCard
        className="shadow-sm mb-4"
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
            className="mb-1 fw-semibold"
            style={{ color: "#111111" }}
          >
            Store Settings
          </h5>

          <small style={{ color: "#7A6A76" }}>
            Control store availability and customer access
          </small>
        </CCardHeader>

        <CCardBody className="p-4">
          <div
            className="p-3 mb-3"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "8px",
            }}
          >
            <CFormCheck
              type="switch"
              name="maintenanceMode"
              label="Maintenance Mode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              disabled={!editMode}
            />

            <small
              className="d-block mt-1"
              style={{
                color: "#7A6A76",
                marginLeft: "2.5rem",
              }}
            >
              Temporarily disable the storefront while maintenance is
              being performed.
            </small>
          </div>

          <div
            className="p-3 mb-3"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "8px",
            }}
          >
            <CFormCheck
              type="switch"
              name="allowGuestCheckout"
              label="Allow Guest Checkout"
              checked={settings.allowGuestCheckout}
              onChange={handleChange}
              disabled={!editMode}
            />

            <small
              className="d-block mt-1"
              style={{
                color: "#7A6A76",
                marginLeft: "2.5rem",
              }}
            >
              Allow customers to place orders without creating an
              account.
            </small>
          </div>

          <div
            className="p-3"
            style={{
              backgroundColor: "#FFF4FA",
              border: "1px solid #E6C5DE",
              borderRadius: "8px",
            }}
          >
            <CFormCheck
              type="switch"
              name="allowVendorRegistration"
              label="Allow Vendor Registration"
              checked={settings.allowVendorRegistration}
              onChange={handleChange}
              disabled={!editMode}
            />

            <small
              className="d-block mt-1"
              style={{
                color: "#7A6A76",
                marginLeft: "2.5rem",
              }}
            >
              Allow new vendors to register and request approval.
            </small>
          </div>
        </CCardBody>
      </CCard>

      {/* ================= Shipping & Tax ================= */}
      <CCard
        className="shadow-sm mb-4"
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
            className="mb-1 fw-semibold"
            style={{ color: "#111111" }}
          >
            Shipping & Tax
          </h5>

          <small style={{ color: "#7A6A76" }}>
            Configure default shipping charges and tax settings
          </small>
        </CCardHeader>

        <CCardBody className="p-4">
          <CRow className="g-3">
            {/* Shipping Charge */}
            <CCol md={4}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Shipping Charge (₹)
              </CFormLabel>

              <CFormInput
                type="number"
                name="shippingCharge"
                value={settings.shippingCharge}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>

            {/* Free Shipping */}
            <CCol md={4}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Free Shipping Above (₹)
              </CFormLabel>

              <CFormInput
                type="number"
                name="freeShippingAbove"
                value={settings.freeShippingAbove}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>

            {/* Tax Rate */}
            <CCol md={4}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Tax Rate (%)
              </CFormLabel>

              <CFormInput
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                disabled={!editMode || !settings.taxEnabled}
                style={{
                  backgroundColor:
                    editMode && settings.taxEnabled
                      ? "#FFFFFF"
                      : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>

            {/* Tax Switch */}
            <CCol xs={12}>
              <div
                className="p-3"
                style={{
                  backgroundColor: "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                }}
              >
                <CFormCheck
                  type="switch"
                  name="taxEnabled"
                  label="Enable Tax"
                  checked={settings.taxEnabled}
                  onChange={handleChange}
                  disabled={!editMode}
                />

                <small
                  className="d-block mt-1"
                  style={{
                    color: "#7A6A76",
                    marginLeft: "2.5rem",
                  }}
                >
                  Apply tax to customer orders using the configured tax
                  rate.
                </small>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= SEO Settings ================= */}
      <CCard
        className="shadow-sm mb-4"
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
            className="mb-1 fw-semibold"
            style={{ color: "#111111" }}
          >
            SEO Settings
          </h5>

          <small style={{ color: "#7A6A76" }}>
            Manage search engine title and description
          </small>
        </CCardHeader>

        <CCardBody className="p-4">
          <CRow className="g-3">
            <CCol xs={12}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Meta Title
              </CFormLabel>

              <CFormInput
                name="metaTitle"
                value={settings.metaTitle}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>

            <CCol xs={12}>
              <CFormLabel
                className="fw-semibold"
                style={{ color: "#111111" }}
              >
                Meta Description
              </CFormLabel>

              <CFormTextarea
                rows={3}
                name="metaDescription"
                value={settings.metaDescription}
                onChange={handleChange}
                disabled={!editMode}
                style={{
                  backgroundColor: editMode ? "#FFFFFF" : "#FFF4FA",
                  border: "1px solid #E6C5DE",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* ================= Action Buttons ================= */}
      <div className="d-flex justify-content-end gap-2 mb-4">
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
            Edit Settings
          </CButton>
        )}
      </div>
    </CContainer>
  );
};

export default WebsiteSettings;

