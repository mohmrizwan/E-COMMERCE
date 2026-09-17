import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilCloudUpload, cilPlus } from "@coreui/icons";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const AddProduct = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("vendorToken");

    const formData = new FormData(e.target);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/vendor/products/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      console.log(error.response?.data);

      // Error message
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Add Product</h3>

          <p className="text-body-secondary mb-0">
            Create and publish a new product to your store
          </p>
        </div>

        <CButton
          color="light"
          className="border shadow-sm"
          onClick={() => window.history.back()}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back
        </CButton>
      </div>

      {/* Form */}
      <CForm onSubmit={handleSubmit}>
        <CRow className="g-4">
          {/* LEFT */}
          <CCol lg={8}>
            {/* Basic Information */}
            <CCard className="border-0 shadow-sm mb-4">
              <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">Basic Information</h5>

                <small className="text-body-secondary">
                  Add the basic details of your product
                </small>
              </CCardHeader>

              <CCardBody className="px-4 pb-4">
                {/* Product Name */}
                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Product Name</CFormLabel>

                  <CFormInput
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    className="py-2"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Description</CFormLabel>

                  <CFormTextarea
                    name="description"
                    rows={5}
                    placeholder="Write a detailed description for your product..."
                    className="py-2"
                    required
                  />
                </div>

                <CRow>
                  {/* Category */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Category</CFormLabel>

                      <CFormSelect name="category" className="py-2" required>
                        <option value="">Select category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="shoes">Shoes</option>
                        <option value="accessories">Accessories</option>
                      </CFormSelect>
                    </div>
                  </CCol>

                  {/* SKU removed because it is not in Product Schema */}
                </CRow>
              </CCardBody>
            </CCard>

            {/* Pricing */}
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">Pricing & Inventory</h5>

                <small className="text-body-secondary">
                  Set the product price and available stock
                </small>
              </CCardHeader>

              <CCardBody className="px-4 pb-4">
                <CRow>
                  {/* Price */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Price</CFormLabel>

                      <CFormInput
                        type="number"
                        name="pricing"
                        placeholder="₹ 0.00"
                        className="py-2"
                        min="0"
                        required
                      />
                    </div>
                  </CCol>

                  {/* Stock */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Stock Quantity
                      </CFormLabel>

                      <CFormInput
                        type="number"
                        name="stockQuantity"
                        placeholder="Enter quantity"
                        className="py-2"
                        min="0"
                        required
                      />
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>

          {/* RIGHT */}
          <CCol lg={4}>
            {/* Product Image */}
            <CCard className="border-0 shadow-sm mb-4">
              <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">Product Image</h5>

                <small className="text-body-secondary">
                  Upload the main product image
                </small>
              </CCardHeader>

              <CCardBody className="px-4 pb-4">
                <label
                  htmlFor="productImage"
                  className="border border-2 rounded-4 d-flex flex-column align-items-center justify-content-center text-center"
                  style={{
                    minHeight: "260px",
                    cursor: "pointer",
                    borderStyle: "dashed",
                  }}
                >
                  {image ? (
                    <div className="p-3 w-100 text-center">
                      <img
                        src={image}
                        alt="Product Preview"
                        className="img-fluid rounded-3"
                        style={{
                          maxHeight: "220px",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />

                      <small className="d-block text-primary fw-semibold mt-3">
                        Click to change image
                      </small>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "64px",
                          height: "64px",
                        }}
                      >
                        <CIcon
                          icon={cilCloudUpload}
                          size="xl"
                          className="text-primary"
                        />
                      </div>

                      <div className="fw-semibold mb-1">
                        Upload Product Image
                      </div>

                      <small className="text-body-secondary">
                        Click to browse from your computer
                      </small>

                      <div className="mt-2">
                        <small className="text-body-secondary">
                          PNG, JPG or WEBP • Max 5MB
                        </small>
                      </div>
                    </div>
                  )}
                </label>

                <CFormInput
                  id="productImage"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="d-none"
                  onChange={handleImageChange}
                  required
                />
              </CCardBody>
            </CCard>

            {/* Product Status */}
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">Product Status</h5>

                <small className="text-body-secondary">
                  Choose whether the product is visible
                </small>
              </CCardHeader>

              <CCardBody className="px-4 pb-4">
                <CFormSelect
                  name="status"
                  className="py-2"
                  defaultValue="active"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Bottom Actions */}
        <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
          <CButton
            color="light"
            type="button"
            className="border"
            onClick={() => window.history.back()}
          >
            Cancel
          </CButton>

          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

export default AddProduct;
