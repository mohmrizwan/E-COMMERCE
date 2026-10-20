import { useEffect, useState } from "react";
import axios from "axios";
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
  CSpinner,
} from "@coreui/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { apiUrl } from "../../config/api.js";


const emptyPickupAddress = {
  shiprocketLocationName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const VendorProfile = () => {
  // =========================
  // Vendor Profile
  // =========================
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    payoutMethod: "bank",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // =========================
  // Pickup Address
  // =========================
  const [pickupAddress, setPickupAddress] =
    useState(emptyPickupAddress);
  const [pickupLocations, setPickupLocations] = useState([]);

  const [pickupAddressError, setPickupAddressError] = useState("");
  const [pickupAddressMessage, setPickupAddressMessage] = useState("");

  const [isLoadingPickupAddress, setIsLoadingPickupAddress] =
    useState(true);

  const [isSavingPickupAddress, setIsSavingPickupAddress] =
    useState(false);

  // =========================
  // Profile Edit Mode
  // =========================
  const [editMode, setEditMode] = useState(false);

  const shiprocketAddress = [
    pickupAddress.address,
    pickupAddress.city,
    pickupAddress.state,
    pickupAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // =========================
  // Get Pickup Address
  // =========================
  const getPickupAddress = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(
        apiUrl("vendor/profile/pickup-address"),
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        },
      );

      setPickupAddress({
        ...emptyPickupAddress,
        ...response.data.pickupAddress,
      });
      setPickupLocations(response.data.pickupLocations || []);

      setPickupAddressError("");
    } catch (error) {
      setPickupAddressError(
        error.response?.data?.message ||
          "Could not load the pickup address.",
      );
    } finally {
      setIsLoadingPickupAddress(false);
    }
  };

  // =========================
  // Get Vendor Profile
  // =========================
  const getProfileData = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(
        apiUrl("vendor/myProfile"),
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        },
      );

      const vendorProfile =
        response.data.vendorProfile;

      setFormData({
        businessName: vendorProfile.businessName || "",
        ownerName: vendorProfile.ownerName || "",
        email: vendorProfile.email || "",
        phone: vendorProfile.phone || "",
        address: vendorProfile.address || "",
        description: vendorProfile.description || "",
        accountHolderName:
          vendorProfile.accountHolderName || "",
        bankName: vendorProfile.bankName || "",
        accountNumber:
          vendorProfile.accountNumber || "",
        ifscCode: vendorProfile.ifscCode || "",
        upiId: vendorProfile.upiId || "",
        payoutMethod:
          vendorProfile.payoutMethod || "bank",
      });

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong",
      );

      setMessage("");
    }
  };

  // =========================
  // Page Load
  // =========================
  useEffect(() => {
    getPickupAddress();
    getProfileData();
  }, []);

  // =========================
  // Profile Input Change
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Profile Save
  // =========================
  const handleSave = async () => {
    const requiredFields = [
      ["businessName", "Shop Name"],
      ["ownerName", "Owner Name"],
      ["email", "Email"],
      ["phone", "Phone"],
    ];

    const emptyFields = requiredFields
      .filter(
        ([field]) =>
          !String(formData[field] || "").trim(),
      )
      .map(([, label]) => label);

    if (emptyFields.length) {
      setErrorMessage(
        `Please fill in: ${emptyFields.join(", ")}.`,
      );
      return;
    }

    setErrorMessage("");
    setMessage("");
    setIsSavingProfile(true);
    try {
      const response = await axios.put(
        apiUrl("vendor/myProfile"),
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        },
      );
      const vendorProfile = response.data.vendorProfile;
      setFormData((current) => ({
        ...current,
        businessName: vendorProfile.businessName || "",
        ownerName: vendorProfile.ownerName || "",
        email: vendorProfile.email || current.email,
        phone: vendorProfile.phone || "",
        description: vendorProfile.description || "",
        accountHolderName: vendorProfile.accountHolderName || "",
        bankName: vendorProfile.bankName || "",
        accountNumber: vendorProfile.accountNumber || "",
        ifscCode: vendorProfile.ifscCode || "",
        upiId: vendorProfile.upiId || "",
        payoutMethod: vendorProfile.payoutMethod || "bank",
      }));
      setMessage(response.data.message || "Profile changes saved.");
      setEditMode(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not save profile changes.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // =========================
  // Save Pickup Address
  // =========================
  const savePickupAddress = async (addressToSave = pickupAddress) => {
    setPickupAddressError("");
    setPickupAddressMessage("");

    const selectedPickupAddress = pickupLocations.find(
      (location) => location.shiprocketLocationName === addressToSave.shiprocketLocationName,
    );
    if (!selectedPickupAddress) {
      setPickupAddressError(
        "Select a registered Shiprocket pickup location before saving.",
      );
      return;
    }

    setIsSavingPickupAddress(true);

    try {
      const response = await axios.put(
        apiUrl("vendor/profile/pickup-address"),
        { shiprocketLocationName: selectedPickupAddress.shiprocketLocationName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "vendorToken",
            )}`,
          },
        },
      );

      setPickupAddress(
        response.data.pickupAddress,
      );

      setPickupAddressMessage(
        response.data.message ||
          "Pickup address saved successfully.",
      );
    } catch (error) {
      setPickupAddressError(
        error.response?.data?.message ||
          "Could not save the pickup address.",
      );
    } finally {
      setIsSavingPickupAddress(false);
    }
  };

  return (
    <CContainer fluid className="py-3">

      {/* =========================
          Success Snackbar
      ========================= */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* =========================
          Error Snackbar
      ========================= */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* =========================
          Header
      ========================= */}
      <CRow className="align-items-end mb-4">
        <CCol>
          <p className="text-uppercase text-primary fw-semibold small mb-1">
            Account center
          </p>

          <h3 className="fw-bold mb-1">
            Vendor Profile
          </h3>

          <p className="text-body-secondary mb-0">
            Keep your store identity and payout
            information up to date.
          </p>
        </CCol>

        <CCol xs="auto">
          {!editMode && (
            <CButton
              color="primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </CButton>
          )}
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>Razorpay Payments</CCardHeader>
        <CCardBody>
          <Alert severity="info">
            Standard Payments use the Key ID and Key Secret configured in this store deployment's backend environment. The secret is not entered or stored in this panel. Contact the deployment administrator to configure payment credentials.
          </Alert>
        </CCardBody>
      </CCard>
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardBody className="px-4">
          <Alert severity="info" className="mb-0">
            Shiprocket credentials are managed in the backend deployment environment. Configure SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD there. This profile only manages the pickup address.
          </Alert>
        </CCardBody>
      </CCard>

      {/* =========================
          Shiprocket Pickup Address
      ========================= */}
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="bg-white border-0 px-4 pt-4">
          <h5 className="mb-1">
            Shiprocket pickup / warehouse address
          </h5>

          <p className="text-body-secondary small mb-0">
            Choose a pickup location registered in your Shiprocket account.
          </p>
        </CCardHeader>

        <CCardBody className="px-4">
          {isLoadingPickupAddress ? (
            <div
              role="status"
              className="d-flex align-items-center justify-content-center gap-2 text-sm text-body-secondary"
              style={{ minHeight: "112px" }}
            >
              <CSpinner
                size="sm"
                aria-hidden="true"
              />
              Loading pickup address...
            </div>
          ) : (
            <>
              {pickupLocations.length === 0 ? (
                <Alert severity="info">No Shiprocket pickup address found. Please add a pickup address in your Shiprocket account.</Alert>
              ) : (
                <>
                  <CRow className="g-3">
                    <CCol xs={12}>
                      <CFormLabel>Pickup Location Name</CFormLabel>
                      <CFormSelect
                        value={pickupAddress.shiprocketLocationName || ""}
                        onChange={(event) => {
                          const selected = pickupLocations.find((location) => location.shiprocketLocationName === event.target.value);
                          if (selected) {
                            setPickupAddress(selected);
                            savePickupAddress(selected);
                          }
                        }}
                      >
                        <option value="">Select a pickup location</option>
                        {pickupLocations.map((location) => (
                          <option key={location.shiprocketLocationName} value={location.shiprocketLocationName}>
                            {location.shiprocketLocationName}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    {[["Address", "address"], ["City", "city"], ["State", "state"], ["Pincode", "pincode"]].map(([label, field]) => (
                      <CCol md={field === "address" ? 12 : 4} key={field}>
                        <CFormLabel>{label}</CFormLabel>
                        <CFormInput value={pickupAddress[field] || ""} readOnly />
                      </CCol>
                    ))}
                  </CRow>
                  {isSavingPickupAddress && (
                    <p className="small text-body-secondary mt-2 mb-0" role="status">
                      Saving selected pickup location...
                    </p>
                  )}
                </>
              )}

              {(pickupAddressError || pickupAddressMessage) && (
                <p
                  role={
                    pickupAddressError
                      ? "alert"
                      : "status"
                  }
                  className={`mt-3 mb-0 small ${
                    pickupAddressError
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {pickupAddressError ||
                    pickupAddressMessage}
                </p>
              )}

            </>
          )}
        </CCardBody>
      </CCard>

      {/* =========================
          Profile
      ========================= */}
      <CRow className="g-4">

        {/* Left Profile Card */}
        <CCol xl={4}>
          <CCard className="h-100 border-0 shadow-sm">

            {/* Profile Header */}
            <div className="bg-primary text-white p-4">
              <div className="d-flex justify-content-between align-items-start gap-3">

                <div>
                  <div className="small text-white-50 mb-1">
                    Vendor Account
                  </div>

                  <h4 className="fw-bold mb-1">
                    {formData.businessName}
                  </h4>

                  <p className="mb-0 text-white-50">
                    {formData.ownerName ||
                      "Owner"}
                  </p>
                </div>

                <span className="badge rounded-pill bg-white text-primary px-3 py-2">
                  Active
                </span>

              </div>
            </div>

            {/* Profile Details */}
            <CCardBody className="p-4">

              <div className="mb-4">
                <div className="small text-body-secondary mb-1">
                  Email Address
                </div>

                <div className="fw-semibold text-break">
                  {formData.email ||
                    "Not available"}
                </div>
              </div>

              <div className="border-top pt-3 mb-4">
                <div className="small text-body-secondary mb-1">
                  Phone Number
                </div>

                <div className="fw-semibold">
                  {formData.phone ||
                    "Not available"}
                </div>
              </div>

              <div className="border-top pt-3 mb-4">
                <div className="small text-body-secondary mb-1">
                  Shop Address
                </div>

                <div className="fw-semibold">
                  {shiprocketAddress ||
                    "Not available"}
                </div>
              </div>

              <div className="border-top pt-3">
                <div className="small text-body-secondary mb-1">
                  Account Status
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span
                    className="rounded-circle bg-success"
                    style={{
                      width: "8px",
                      height: "8px",
                      display: "inline-block",
                    }}
                  />

                  <span className="fw-semibold text-success">
                    Account Active
                  </span>
                </div>
              </div>

            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Side */}
        <CCol xl={8}>

          {/* Business Information */}
          <CCard className="border-0 shadow-sm mb-4">

            <CCardHeader className="bg-white border-0 px-4 pt-4">
              <h5 className="mb-1">
                Business information
              </h5>

              <p className="text-body-secondary small mb-0">
                Manage store details and customer information.
              </p>
            </CCardHeader>

            <CCardBody className="px-4">
              <CRow>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Shop Name
                    </CFormLabel>

                    <CFormInput
                      required
                      name="businessName"
                      value={
                        formData.businessName
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Owner Name
                    </CFormLabel>

                    <CFormInput
                      required
                      name="ownerName"
                      value={
                        formData.ownerName
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Email
                    </CFormLabel>

                    <CFormInput
                      required
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={handleChange}
                      disabled
                    />
                    <small className="text-body-secondary">Email changes require account verification and cannot be edited here.</small>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Phone
                    </CFormLabel>

                    <CFormInput
                      required
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol xs={12}>
                  <div className="mb-3">
                    <CFormLabel>
                      Shop Address
                    </CFormLabel>

                    <CFormInput
                      value={
                        shiprocketAddress
                      }
                      readOnly
                    />
                  </div>
                </CCol>

                <CCol xs={12}>
                  <div className="mb-2">
                    <CFormLabel>
                      Business Description
                    </CFormLabel>

                    <CFormTextarea
                      rows={3}
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

              </CRow>
            </CCardBody>
          </CCard>

          {/* Payment & Bank Details */}
          <CCard className="border-0 shadow-sm">

            <CCardHeader className="bg-white border-0 px-4 pt-4">
              <div className="d-flex justify-content-between align-items-start gap-3">

                <div>
                  <h5 className="mb-1">
                    Payment & Bank Details
                  </h5>

                  <p className="text-body-secondary small mb-0">
                    Where your store earnings
                    will be deposited.
                  </p>
                </div>

                <span className="badge bg-success-subtle text-success">
                  Payout ready
                </span>

              </div>
            </CCardHeader>

            <CCardBody className="px-4">
              <CRow>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Account Holder Name
                    </CFormLabel>

                    <CFormInput
                      name="accountHolderName"
                      value={
                        formData.accountHolderName
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Bank Name
                    </CFormLabel>

                    <CFormInput
                      name="bankName"
                      value={
                        formData.bankName
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Account Number
                    </CFormLabel>

                    <CFormInput
                      type="text"
                      inputMode="numeric"
                      name="accountNumber"
                      value={
                        formData.accountNumber
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      IFSC Code
                    </CFormLabel>

                    <CFormInput
                      name="ifscCode"
                      value={
                        formData.ifscCode
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      UPI ID (Optional)
                    </CFormLabel>

                    <CFormInput
                      name="upiId"
                      value={
                        formData.upiId
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>
                      Preferred Payout Method
                    </CFormLabel>

                    <CFormSelect
                      name="payoutMethod"
                      value={
                        formData.payoutMethod
                      }
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <option value="bank">
                        Bank Account
                      </option>

                      <option value="upi">
                        UPI
                      </option>
                    </CFormSelect>
                  </div>
                </CCol>

              </CRow>

              {editMode && (
                <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-2">

                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() =>
                      setEditMode(false)
                    }
                  >
                    Cancel
                  </CButton>

                  <CButton
                    color="primary"
                    onClick={handleSave}
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Saving..." : "Save Changes"}
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
