import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { API_URL, apiUrl } from "../../config/api.js";
import { getCategories } from "../../api/categories.js";
import { getBrands } from "../../api/brands.js";

const AddProduct = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await getCategories();
        setCategories(list);
      } catch (error) {
        console.error("Could not load categories.", error);
      }
    };

    const loadBrands = async () => {
      try {
        const list = await getBrands();
        setBrands(list);
      } catch (error) {
        console.error("Could not load brands.", error);
      }
    };

    loadCategories();
    loadBrands();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setSelectedImages(files.map((file) => URL.createObjectURL(file)));
      setImage(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("vendorToken");

    const formData = new FormData(e.target);

    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const category = formData.get("category")?.toString().trim() || "";
    const brand = formData.get("brand")?.toString().trim() || "";
    const pricing = formData.get("pricing")?.toString().trim() || "";
    const stockQuantity = formData.get("stockQuantity")?.toString().trim() || "";
    const status = formData.get("status")?.toString().trim() || "";
    const weight = formData.get("weight")?.toString().trim() || "";
    const length = formData.get("length")?.toString().trim() || "";
    const breadth = formData.get("breadth")?.toString().trim() || "";
    const height = formData.get("height")?.toString().trim() || "";

    if (name.length < 3) {
      setErrorMessage("Product name must be at least 3 characters");
      return;
    }
    if (description.length < 10) {
      setErrorMessage("Description must be at least 10 characters");
      return;
    }
    if (!category) {
      setErrorMessage("Please select a category");
      return;
    }
    if (!brand) {
      setErrorMessage("Please select a brand");
      return;
    }
    if (pricing === "" || Number(pricing) < 0) {
      setErrorMessage("Please enter a valid price");
      return;
    }
    if (stockQuantity === "" || Number(stockQuantity) < 0) {
      setErrorMessage("Please enter a valid stock quantity");
      return;
    }
    if (!status) {
      setErrorMessage("Please select product status");
      return;
    }
    if (!weight || Number(weight) <= 0) {
      setErrorMessage("Weight must be greater than 0 kg");
      return;
    }
    if (!length || Number(length) <= 0.5) {
      setErrorMessage("Length must be greater than 0.5 cm");
      return;
    }
    if (!breadth || Number(breadth) <= 0.5) {
      setErrorMessage("Breadth must be greater than 0.5 cm");
      return;
    }
    if (!height || Number(height) <= 0.5) {
      setErrorMessage("Height must be greater than 0.5 cm");
      return;
    }

    if (!API_URL) {
      throw new Error("VITE_API_URL is not configured for this deployment.");
    }
    if (!token) {
      throw new Error(
        "Your vendor session has expired. Please sign in again.",
      );
    }

    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl("vendor/products/create"),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage(response.data.message);
      setErrorMessage("");

      navigate("/products");
    } catch (error) {

      // Error message
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );

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
      <CForm onSubmit={handleSubmit} noValidate>
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
                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Brand</CFormLabel>

                  <CFormSelect name="brand" className="py-2" required>
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                <CRow>
                  {/* Category */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Category</CFormLabel>

                      <CFormSelect name="category" className="py-2" required>
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
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
                  Set the original price, discount and available stock
                </small>
              </CCardHeader>

              <CCardBody className="px-4 pb-4">
                <CRow>
                  {/* Price */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Original Price
                      </CFormLabel>

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

                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Discount (%)
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        name="discount"
                        placeholder="0"
                        className="py-2"
                        min="0"
                        max="99"
                        step="1"
                        defaultValue="0"
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

            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">Shipping Details</h5>

                <small className="text-body-secondary">
                  Enter packed product measurements for accurate shipping rates
                </small>
              </CCardHeader>

              <CCardBody className="px-4 pb-4">
                <CRow>
                  {/* Weight */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Weight (kg)
                      </CFormLabel>

                      <CFormInput
                        type="number"
                        name="weight"
                        placeholder="e.g. 0.5"
                        className="py-2"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </CCol>

                  {/* Length */}
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Length (cm)
                      </CFormLabel>

                      <CFormInput
                        type="number"
                        name="length"
                        placeholder="Length"
                        className="py-2"
                        min="0.51"
                        step="0.01"
                        required
                      />
                    </div>
                  </CCol>

                  {/* Breadth */}
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Breadth (cm)
                      </CFormLabel>

                      <CFormInput
                        type="number"
                        name="breadth"
                        placeholder="Breadth"
                        className="py-2"
                        min="0.51"
                        step="0.01"
                        required
                      />
                    </div>
                  </CCol>

                  {/* Height */}
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">
                        Height (cm)
                      </CFormLabel>

                      <CFormInput
                        type="number"
                        name="height"
                        placeholder="Height"
                        className="py-2"
                        min="0.51"
                        step="0.01"
                        required
                      />
                    </div>
                  </CCol>
                  <CCol xs={12}>
                    <label className="d-flex align-items-start gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="isDangerous"
                        value="true"
                        className="mt-1"
                      />
                      <span>
                        <span className="fw-semibold d-block">
                          Dangerous goods (surface courier only)
                        </span>
                        <small className="text-body-secondary">
                          Shiprocket prohibits some dangerous goods entirely.
                          Check its prohibited items policy before listing.
                        </small>
                      </span>
                    </label>
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
                    Upload one or more product images
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
                        className="rounded-circle !bg-[#173D35] bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "64px",
                          height: "64px",
                        }}
                      >
                        <CIcon
                          icon={cilCloudUpload}
                          size="xl"
                          className="text-white"
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

                  {selectedImages.length > 1 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {selectedImages.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Preview ${index + 1}`}
                          style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </div>
                  )}

                  <CFormInput
                    id="productImage"
                    name="images"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="d-none"
                    onChange={handleImageChange}
                    multiple
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
                  defaultValue="select status"
                >
                  <option value="select status">Select Status</option>
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

          <CButton type="submit" color="primary" className="!bg-[#173D35]"  disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

export default AddProduct;
