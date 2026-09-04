import { useState } from "react";
import {
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
    accountHolderName: "Mohammad Rizwan",
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifscCode: "SBIN0001234",
    upiId: "mohammad@upi",
    payoutMethod: "bank",
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
      <CRow className="align-items-end mb-4">
        <CCol>
          <p className="text-uppercase text-primary fw-semibold small mb-1">
            Account center
          </p>
          <h3 className="fw-bold mb-1">Vendor Profile</h3>
          <p className="text-body-secondary mb-0">
            Keep your store identity and payout information up to date.
          </p>
        </CCol>
        <CCol xs="auto">
          {!editMode && (
            <CButton color="primary" onClick={() => setEditMode(true)}>
              Edit Profile
            </CButton>
          )}
        </CCol>
      </CRow>

      <CRow className="g-4">
        <CCol xl={4}>
          <CCard className="h-100 border-0 shadow-sm overflow-hidden">
            <div className="bg-primary px-4 pt-4 pb-5 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <span className="small text-white-50">Vendor account</span>
                <span className="badge rounded-pill bg-white text-primary">
                  Active
                </span>
              </div>
              <h4 className="mt-4 mb-1">{formData.shopName}</h4>
              <p className="mb-0 text-white-50">{formData.ownerName}</p>
            </div>
            <CCardBody className="position-relative pt-0">
              <div className="d-flex align-items-end gap-3" style={{ marginTop: "-42px" }}>
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Vendor profile"
                  width="84"
                  height="84"
                  className="rounded-circle border border-4 border-white shadow-sm"
                />
                {editMode && (
                  <CButton color="light" variant="outline" className="mb-2">
                    Change Photo
                  </CButton>
                )}
              </div>

              <div className="mt-4">
                <div className="border-bottom pb-3 mb-3">
                  <div className="small text-body-secondary">Email</div>
                  <div className="fw-semibold text-break">{formData.email}</div>
                </div>
                <div className="border-bottom pb-3 mb-3">
                  <div className="small text-body-secondary">Phone</div>
                  <div className="fw-semibold">{formData.phone}</div>
                </div>
                <div>
                  <div className="small text-body-secondary">Shop location</div>
                  <div className="fw-semibold">{formData.address}</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={8}>
          <CCard className="border-0 shadow-sm mb-4">
            <CCardHeader className="bg-white border-0 px-4 pt-4">
              <h5 className="mb-1">Business information</h5>
              <p className="text-body-secondary small mb-0">
                Details customers and the marketplace use to identify your store.
              </p>
            </CCardHeader>
            <CCardBody className="px-4">
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Shop Name</CFormLabel>
                    <CFormInput name="shopName" value={formData.shopName} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Owner Name</CFormLabel>
                    <CFormInput name="ownerName" value={formData.ownerName} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Phone</CFormLabel>
                    <CFormInput name="phone" value={formData.phone} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol xs={12}>
                  <div className="mb-3">
                    <CFormLabel>Shop Address</CFormLabel>
                    <CFormInput name="address" value={formData.address} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol xs={12}>
                  <div className="mb-2">
                    <CFormLabel>Business Description</CFormLabel>
                    <CFormTextarea rows={3} name="description" value={formData.description} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-white border-0 px-4 pt-4">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h5 className="mb-1">Payment & Bank Details</h5>
                  <p className="text-body-secondary small mb-0">
                    Where your marketplace earnings will be deposited.
                  </p>
                </div>
                <span className="badge bg-success-subtle text-success">Payout ready</span>
              </div>
            </CCardHeader>
            <CCardBody className="px-4">
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Account Holder Name</CFormLabel>
                    <CFormInput name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Bank Name</CFormLabel>
                    <CFormInput name="bankName" value={formData.bankName} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Account Number</CFormLabel>
                    <CFormInput type="text" inputMode="numeric" name="accountNumber" value={formData.accountNumber} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>IFSC Code</CFormLabel>
                    <CFormInput name="ifscCode" value={formData.ifscCode} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>UPI ID (Optional)</CFormLabel>
                    <CFormInput name="upiId" value={formData.upiId} onChange={handleChange} disabled={!editMode} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Preferred Payout Method</CFormLabel>
                    <CFormSelect name="payoutMethod" value={formData.payoutMethod} onChange={handleChange} disabled={!editMode}>
                      <option value="bank">Bank Account</option>
                      <option value="upi">UPI</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              {editMode && (
                <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-2">
                  <CButton color="secondary" variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </CButton>
                  <CButton color="primary" onClick={handleSave}>
                    Save Changes
                  </CButton>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default VendorProfile;