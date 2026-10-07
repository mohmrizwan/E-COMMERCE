import { useEffect, useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormCheck,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CButton,
  CSpinner,
} from "@coreui/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const API_URL = "https://ecommerceba-6dtt.onrender.com";

const emptyPickupAddress = {
  shiprocketLocationName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const emptyShiprocketStatus = {
  enabled: false,
  hasEmail: false,
  hasPassword: false,
};

const emptyRazorpayStatus = {
  isLinked: false,
  enabled: false,
  accountStatus: "",
  productActivationStatus: "",
  settlementVerificationStatus: "",
};

const emptyRazorpayForm = {
  legalBusinessName: "",
  businessType: "",
  pan: "",
  gst: "",
  beneficiaryName: "",
  accountNumber: "",
  ifscCode: "",
  tncAccepted: false,
};

const VendorProfile = () => {
  // Vendor profile data
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

  // Pickup address
  const [pickupAddress, setPickupAddress] = useState(
    emptyPickupAddress,
  );

  const [pickupAddressError, setPickupAddressError] = useState("");
  const [pickupAddressMessage, setPickupAddressMessage] = useState("");
  const [shiprocketStatus, setShiprocketStatus] = useState(
    emptyShiprocketStatus,
  );
  const [shiprocketCredentials, setShiprocketCredentials] = useState({
    email: "",
    password: "",
    enabled: false,
  });
  const [shiprocketSettingsError, setShiprocketSettingsError] = useState("");
  const [shiprocketSettingsMessage, setShiprocketSettingsMessage] =
    useState("");
  const [razorpayStatus, setRazorpayStatus] = useState(emptyRazorpayStatus);
  const [razorpayForm, setRazorpayForm] = useState(emptyRazorpayForm);
  const [razorpayError, setRazorpayError] = useState("");
  const [razorpayMessage, setRazorpayMessage] = useState("");

  const [isLoadingPickupAddress, setIsLoadingPickupAddress] =
    useState(true);
  const [isLoadingShiprocketSettings, setIsLoadingShiprocketSettings] =
    useState(true);

  const [isSavingPickupAddress, setIsSavingPickupAddress] =
    useState(false);
  const [isSavingShiprocketSettings, setIsSavingShiprocketSettings] =
    useState(false);
  const [isLoadingRazorpayStatus, setIsLoadingRazorpayStatus] =
    useState(true);
  const [isSubmittingRazorpay, setIsSubmittingRazorpay] = useState(false);
  const [razorpayStatusRefreshCount, setRazorpayStatusRefreshCount] =
    useState(0);

  const [editMode, setEditMode] = useState(false);
  const shiprocketAddress = [
    pickupAddress.address,
    pickupAddress.city,
    pickupAddress.state,
    pickupAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // Get Pickup Address
  useEffect(() => {
    let isActive = true;

    axios
      .get(`${API_URL}/vendor/profile/pickup-address`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      })
      .then((response) => {
        if (isActive) {
          setPickupAddress({
            ...emptyPickupAddress,
            ...response.data.pickupAddress,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setPickupAddressError(
            error.response?.data?.message ||
              "Could not load the pickup address.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingPickupAddress(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    axios
      .get(`${API_URL}/vendor/integrations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      })
      .then((response) => {
        if (!isActive) return;

        const status = response.data.integrations?.shiprocket ||
          emptyShiprocketStatus;
        setRazorpayStatus(
          response.data.integrations?.razorpay || emptyRazorpayStatus,
        );
        setShiprocketStatus(status);
        setShiprocketCredentials((current) => ({
          ...current,
          enabled: Boolean(status.enabled),
        }));
      })
      .catch((error) => {
        if (isActive) {
          setShiprocketSettingsError(
            error.response?.data?.message ||
              "Could not load Shiprocket settings.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingShiprocketSettings(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const refreshStatus = async () => {
      if (!razorpayStatus.isLinked) {
        setIsLoadingRazorpayStatus(false);
        return;
      }

      setIsLoadingRazorpayStatus(true);
      try {
        const response = await axios.get(
          `${API_URL}/vendor/integrations/razorpay/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
            },
          },
        );
        if (isActive) {
          setRazorpayStatus(response.data.razorpay || emptyRazorpayStatus);
          setRazorpayError("");
        }
      } catch (error) {
        if (isActive) {
          setRazorpayError(
            error.response?.data?.message ||
              "Could not refresh Razorpay verification status.",
          );
        }
      } finally {
        if (isActive) setIsLoadingRazorpayStatus(false);
      }
    };

    refreshStatus();
    return () => {
      isActive = false;
    };
  }, [razorpayStatus.isLinked, razorpayStatusRefreshCount]);

  // Get vendor profile
  const getProfileData = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(
        `${API_URL}/vendor/myProfile`,
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        },
      );
      const vendorProfile = response.data.vendorProfile;

      setFormData({
        businessName: vendorProfile.businessName || "",
        ownerName: vendorProfile.ownerName || "",
        email: vendorProfile.email || "",
        phone: vendorProfile.phone || "",
        address: vendorProfile.address || "",
        description: vendorProfile.description || "",
        accountHolderName: vendorProfile.accountHolderName || "",
        bankName: vendorProfile.bankName || "",
        accountNumber: vendorProfile.accountNumber || "",
        ifscCode: vendorProfile.ifscCode || "",
        upiId: vendorProfile.upiId || "",
        payoutMethod: vendorProfile.payoutMethod || "bank",
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

  // Get profile data when page loads
  useEffect(() => {
    getProfileData();
  }, []);

  // Profile input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Profile save
  const handleSave = () => {
    const requiredFields = [
      ["businessName", "Shop Name"],
      ["ownerName", "Owner Name"],
      ["email", "Email"],
      ["phone", "Phone"],
    ];
    const emptyFields = requiredFields
      .filter(([field]) => !String(formData[field] || "").trim())
      .map(([, label]) => label);

    if (emptyFields.length) {
      setErrorMessage(`Please fill in: ${emptyFields.join(", ")}.`);
      return;
    }

    setErrorMessage("");
    setEditMode(false);
  };

  // Save Pickup Address
  const savePickupAddress = async () => {
    setPickupAddressError("");
    setPickupAddressMessage("");

    const normalizedPickupAddress = Object.fromEntries(
      Object.entries(pickupAddress).map(([field, value]) => [
        field,
        String(value || "").trim(),
      ]),
    );

    const hasEmptyField = Object.values(
      normalizedPickupAddress,
    ).some((value) => !value);

    if (hasEmptyField) {
      setPickupAddressError(
        "Complete all pickup address fields before saving.",
      );
      return;
    }

    if (!/^\d{6}$/.test(normalizedPickupAddress.pincode)) {
      setPickupAddressError(
        "Pickup pincode must be exactly six digits.",
      );
      return;
    }

    setIsSavingPickupAddress(true);

    try {
      const response = await axios.put(
        `${API_URL}/vendor/profile/pickup-address`,
        normalizedPickupAddress,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "vendorToken",
            )}`,
          },
        },
      );

      setPickupAddress(response.data.pickupAddress);
      setPickupAddressMessage(response.data.message);
    } catch (error) {
      setPickupAddressError(
        error.response?.data?.message ||
          "Could not save the pickup address.",
      );
    } finally {
      setIsSavingPickupAddress(false);
    }
  };

  const saveShiprocketSettings = async () => {
    setShiprocketSettingsError("");
    setShiprocketSettingsMessage("");

    const email = shiprocketCredentials.email.trim();
    const password = shiprocketCredentials.password.trim();
    const hasSavedCredentials =
      shiprocketStatus.hasEmail && shiprocketStatus.hasPassword;

    if (
      shiprocketCredentials.enabled &&
      !hasSavedCredentials &&
      (!email || !password)
    ) {
      setShiprocketSettingsError(
        "Enter your Shiprocket email and password before enabling the integration.",
      );
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setShiprocketSettingsError("Enter a valid Shiprocket account email.");
      return;
    }

    setIsSavingShiprocketSettings(true);

    try {
      const response = await axios.put(
        `${API_URL}/vendor/integrations`,
        {
          shiprocket: {
            email,
            password,
            enabled: shiprocketCredentials.enabled,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        },
      );

      const status = response.data.integrations?.shiprocket ||
        emptyShiprocketStatus;
      setShiprocketStatus(status);
      setShiprocketCredentials({ email: "", password: "", enabled: status.enabled });
      setShiprocketSettingsMessage(response.data.message);
    } catch (error) {
      setShiprocketSettingsError(
        error.response?.data?.message ||
          "Could not save Shiprocket settings.",
      );
    } finally {
      setIsSavingShiprocketSettings(false);
    }
  };

  const submitRazorpayOnboarding = async () => {
    setRazorpayError("");
    setRazorpayMessage("");

    if (!razorpayForm.tncAccepted) {
      setRazorpayError("Accept Razorpay Route terms before continuing.");
      return;
    }

    setIsSubmittingRazorpay(true);
    try {
      const response = await axios.post(
        `${API_URL}/vendor/integrations/razorpay/onboard`,
        razorpayForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        },
      );

      setRazorpayStatus(response.data.razorpay || emptyRazorpayStatus);
      setRazorpayForm(emptyRazorpayForm);
      setRazorpayMessage(response.data.message);
    } catch (error) {
      setRazorpayError(
        error.response?.data?.message ||
          "Could not submit Razorpay Route onboarding.",
      );
    } finally {
      setIsSubmittingRazorpay(false);
    }
  };

  return (
    <CContainer fluid className="py-3">
      {/* Success Snackbar */}
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

      {/* Error Snackbar */}
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

      {/* Header */}
      <CRow className="align-items-end mb-4">
        <CCol>
          <p className="text-uppercase text-primary fw-semibold small mb-1">
            Account center
          </p>

          <h3 className="fw-bold mb-1">
            Vendor Profile
          </h3>

          <p className="text-body-secondary mb-0">
            Keep your store identity and payout information up to
            date.
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

      {/* Shiprocket Pickup Address */}
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="bg-white border-0 px-4 pt-4">
          <h5 className="mb-1">
            Shiprocket pickup / warehouse address
          </h5>

          <p className="text-body-secondary small mb-0">
            The location name must exactly match a pickup location
            registered in your Shiprocket account.
          </p>
        </CCardHeader>

        <CCardBody className="px-4">
          {isLoadingPickupAddress ? (
            <div
              role="status"
              className="d-flex align-items-center justify-content-center gap-2 text-sm text-body-secondary"
              style={{ minHeight: "112px" }}
            >
              <CSpinner size="sm" aria-hidden="true" />
              Loading pickup address...
            </div>
          ) : (
            <>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>
                    Registered Shiprocket pickup location name
                  </CFormLabel>

                  <CFormInput
                    required
                    value={
                      pickupAddress.shiprocketLocationName
                    }
                    onChange={(event) =>
                      setPickupAddress((current) => ({
                        ...current,
                        shiprocketLocationName:
                          event.target.value,
                      }))
                    }
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>
                    Pickup address
                  </CFormLabel>

                  <CFormInput
                    required
                    value={pickupAddress.address}
                    onChange={(event) =>
                      setPickupAddress((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </CCol>

                <CCol md={4}>
                  <CFormLabel>City</CFormLabel>

                  <CFormInput
                    required
                    value={pickupAddress.city}
                    onChange={(event) =>
                      setPickupAddress((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                  />
                </CCol>

                <CCol md={4}>
                  <CFormLabel>State</CFormLabel>

                  <CFormInput
                    required
                    value={pickupAddress.state}
                    onChange={(event) =>
                      setPickupAddress((current) => ({
                        ...current,
                        state: event.target.value,
                      }))
                    }
                  />
                </CCol>

                <CCol md={4}>
                  <CFormLabel>
                    Pickup pincode
                  </CFormLabel>

                  <CFormInput
                    required
                    inputMode="numeric"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={pickupAddress.pincode}
                    onChange={(event) =>
                      setPickupAddress((current) => ({
                        ...current,
                        pincode: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      }))
                    }
                  />
                </CCol>
              </CRow>

              {(pickupAddressError ||
                pickupAddressMessage) && (
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

              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="primary"
                  onClick={savePickupAddress}
                  disabled={
                    isLoadingPickupAddress ||
                    isSavingPickupAddress
                  }
                >
                  {isSavingPickupAddress
                    ? "Saving..."
                    : "Save pickup address"}
                </CButton>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="bg-white border-0 px-4 pt-4">
          <h5 className="mb-1">Shiprocket account</h5>
          <p className="text-body-secondary small mb-0">
            Connect your own Shiprocket account. Credentials are encrypted on
            the backend and never returned to this page.
          </p>
        </CCardHeader>
        <CCardBody className="px-4">
          {isLoadingShiprocketSettings ? (
            <div
              role="status"
              className="d-flex align-items-center justify-content-center gap-2 text-sm text-body-secondary"
              style={{ minHeight: "112px" }}
            >
              <CSpinner size="sm" aria-hidden="true" />
              Loading Shiprocket settings...
            </div>
          ) : (
            <>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="shiprocket-email">
                    Shiprocket account email
                  </CFormLabel>
                  <CFormInput
                    id="shiprocket-email"
                    type="email"
                    autoComplete="username"
                    value={shiprocketCredentials.email}
                    placeholder={
                      shiprocketStatus.hasEmail
                        ? "Saved; leave blank to keep current email"
                        : "Enter your Shiprocket email"
                    }
                    onChange={(event) =>
                      setShiprocketCredentials((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="shiprocket-password">
                    Shiprocket account password
                  </CFormLabel>
                  <CFormInput
                    id="shiprocket-password"
                    type="password"
                    autoComplete="new-password"
                    value={shiprocketCredentials.password}
                    placeholder={
                      shiprocketStatus.hasPassword
                        ? "Saved; leave blank to keep current password"
                        : "Enter your Shiprocket password"
                    }
                    onChange={(event) =>
                      setShiprocketCredentials((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="shiprocket-enabled">
                    Use Shiprocket for vendor shipping
                  </CFormLabel>
                  <CFormSelect
                    id="shiprocket-enabled"
                    value={String(shiprocketCredentials.enabled)}
                    onChange={(event) =>
                      setShiprocketCredentials((current) => ({
                        ...current,
                        enabled: event.target.value === "true",
                      }))
                    }
                  >
                    <option value="false">Disabled</option>
                    <option value="true">Enabled</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {(shiprocketSettingsError || shiprocketSettingsMessage) && (
                <p
                  role={shiprocketSettingsError ? "alert" : "status"}
                  className={`mt-3 mb-0 small ${
                    shiprocketSettingsError ? "text-danger" : "text-success"
                  }`}
                >
                  {shiprocketSettingsError || shiprocketSettingsMessage}
                </p>
              )}

              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="primary"
                  onClick={saveShiprocketSettings}
                  disabled={isSavingShiprocketSettings}
                >
                  {isSavingShiprocketSettings
                    ? "Saving..."
                    : "Save Shiprocket settings"}
                </CButton>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="bg-white border-0 px-4 pt-4">
          <h5 className="mb-1">Razorpay marketplace payouts</h5>
          <p className="text-body-secondary small mb-0">
            Complete Route onboarding so marketplace payouts can be linked to
            your settlement account. Your bank and PAN details are submitted
            to Razorpay; this app stores only the linked account and its status.
          </p>
        </CCardHeader>
        <CCardBody className="px-4">
          {isLoadingRazorpayStatus ? (
            <div
              role="status"
              className="d-flex align-items-center justify-content-center gap-2 text-sm text-body-secondary"
              style={{ minHeight: "112px" }}
            >
              <CSpinner size="sm" aria-hidden="true" />
              Loading Razorpay status...
            </div>
          ) : razorpayStatus.isLinked ? (
            <>
              <CRow className="g-3">
                <CCol md={4}>
                  <div className="small text-body-secondary">Account</div>
                  <div className="fw-semibold">
                    {razorpayStatus.accountStatus || "Submitted"}
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="small text-body-secondary">Route activation</div>
                  <div className="fw-semibold">
                    {razorpayStatus.productActivationStatus || "Pending"}
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="small text-body-secondary">
                    Bank verification
                  </div>
                  <div className="fw-semibold">
                    {razorpayStatus.settlementVerificationStatus || "Pending"}
                  </div>
                </CCol>
              </CRow>
              {!razorpayStatus.enabled && (
                <p className="text-body-secondary small mt-3 mb-0">
                  Payouts become available after Razorpay activates Route and
                  verifies the settlement account.
                </p>
              )}
              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() =>
                    setRazorpayStatusRefreshCount((count) => count + 1)
                  }
                  disabled={isLoadingRazorpayStatus}
                >
                  Refresh verification status
                </CButton>
              </div>
            </>
          ) : (
            <>
              <p className="small text-body-secondary mb-3">
                Razorpay account contact: {formData.email || "Loading profile"}
                {formData.phone ? ` · ${formData.phone}` : ""}
              </p>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-legal-name">
                    Legal business name
                  </CFormLabel>
                  <CFormInput
                    id="razorpay-legal-name"
                    autoComplete="organization"
                    value={razorpayForm.legalBusinessName}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        legalBusinessName: event.target.value,
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-business-type">
                    Business type
                  </CFormLabel>
                  <CFormSelect
                    id="razorpay-business-type"
                    value={razorpayForm.businessType}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        businessType: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select business type</option>
                    <option value="individual">Individual</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="llp">LLP</option>
                    <option value="private_limited">Private limited</option>
                    <option value="public_limited">Public limited</option>
                    <option value="ngo">NGO</option>
                    <option value="society">Society</option>
                    <option value="trust">Trust</option>
                    <option value="educational_institutes">
                      Educational institute
                    </option>
                    <option value="other">Other</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-pan">PAN</CFormLabel>
                  <CFormInput
                    id="razorpay-pan"
                    autoComplete="off"
                    maxLength={10}
                    value={razorpayForm.pan}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        pan: event.target.value.toUpperCase().slice(0, 10),
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-gst">GSTIN (if applicable)</CFormLabel>
                  <CFormInput
                    id="razorpay-gst"
                    autoComplete="off"
                    maxLength={15}
                    value={razorpayForm.gst}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        gst: event.target.value.toUpperCase().slice(0, 15),
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-beneficiary">
                    Bank account holder name
                  </CFormLabel>
                  <CFormInput
                    id="razorpay-beneficiary"
                    autoComplete="name"
                    value={razorpayForm.beneficiaryName}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        beneficiaryName: event.target.value,
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-account-number">
                    Bank account number
                  </CFormLabel>
                  <CFormInput
                    id="razorpay-account-number"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={20}
                    value={razorpayForm.accountNumber}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        accountNumber: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 20),
                      }))
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="razorpay-ifsc">IFSC code</CFormLabel>
                  <CFormInput
                    id="razorpay-ifsc"
                    autoComplete="off"
                    maxLength={11}
                    value={razorpayForm.ifscCode}
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        ifscCode: event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 11),
                      }))
                    }
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormCheck
                    id="razorpay-route-terms"
                    checked={razorpayForm.tncAccepted}
                    label="I accept Razorpay Route terms for this vendor account."
                    onChange={(event) =>
                      setRazorpayForm((current) => ({
                        ...current,
                        tncAccepted: event.target.checked,
                      }))
                    }
                  />
                </CCol>
              </CRow>

              {(razorpayError || razorpayMessage) && (
                <p
                  role={razorpayError ? "alert" : "status"}
                  className={`mt-3 mb-0 small ${
                    razorpayError ? "text-danger" : "text-success"
                  }`}
                >
                  {razorpayError || razorpayMessage}
                </p>
              )}

              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="primary"
                  onClick={submitRazorpayOnboarding}
                  disabled={isSubmittingRazorpay}
                >
                  {isSubmittingRazorpay
                    ? "Submitting..."
                    : "Submit Razorpay onboarding"}
                </CButton>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Profile */}
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
                Details customers and the marketplace use
                to identify your store.
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
                      value={formData.businessName}
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
                      value={formData.ownerName}
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
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
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
                      value={formData.phone}
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
                      value={shiprocketAddress}
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
                      value={formData.description}
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
                    Where your marketplace earnings will
                    be deposited.
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
                      value={formData.bankName}
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
                      value={formData.ifscCode}
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
                      value={formData.upiId}
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
                  >
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

