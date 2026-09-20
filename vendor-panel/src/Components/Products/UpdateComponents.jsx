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
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductLoader from "../../Components/ProductLoader";

// MUI
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const UpadteProduct = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    pricing: "",
    stockQuantity: "",
    status: "",
  });

  // ================= GET PRODUCT =================

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("vendorToken");

        const response = await axios.get(
          `https://ecommerceba-6dtt.onrender.com/vendor/products/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data =
          response.data.product ||
          response.data.products ||
          response.data;

        setProduct({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          pricing: data.pricing ?? "",
          stockQuantity: data.stockQuantity ?? "",
          status: data.status || "",
        });

        // Existing image
        if (data.image) {
          setImage(data.image);
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load product",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= IMAGE CHANGE =================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Only PNG, JPG or WEBP images are allowed",
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "Image size must be less than 5MB",
      );

      e.target.value = "";
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  // ================= UPDATE PRODUCT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name validation
    if (!product.name.trim()) {
      setErrorMessage("Product name is required");
      return;
    }

    if (product.name.trim().length < 3) {
      setErrorMessage(
        "Product name must be at least 3 characters",
      );
      return;
    }

    // Description validation
    if (!product.description.trim()) {
      setErrorMessage(
        "Product description is required",
      );
      return;
    }

    if (product.description.trim().length < 10) {
      setErrorMessage(
        "Description must be at least 10 characters",
      );
      return;
    }

    // Category validation
    if (!product.category) {
      setErrorMessage("Please select a category");
      return;
    }

    // Pricing validation
    if (product.pricing === "") {
      setErrorMessage("Product price is required");
      return;
    }

    if (Number(product.pricing) < 0) {
      setErrorMessage("Price cannot be negative");
      return;
    }

    // Stock validation
    if (product.stockQuantity === "") {
      setErrorMessage(
        "Stock quantity is required",
      );
      return;
    }

    if (Number(product.stockQuantity) < 0) {
      setErrorMessage(
        "Stock quantity cannot be negative",
      );
      return;
    }

    // Status validation
    if (!product.status) {
      setErrorMessage("Please select product status");
      return;
    }

    // ================= UPDATE API =================

    setUpdating(true);

    try {
      const token = localStorage.getItem("vendorToken");

      const response = await axios.put(
        `https://ecommerceba-6dtt.onrender.com/vendor/products/update/${id}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage(
        response.data.message ||
          "Product updated successfully",
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong while updating product",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="pb-4">
      {/* ================= Header ================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            Update Product
          </h3>

          <p className="text-body-secondary mb-0">
            Update and publish a new product to your store
          </p>
        </div>

        <CButton
          color="light"
          className="border shadow-sm"
          onClick={() => window.history.back()}
          disabled={updating}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back
        </CButton>
      </div>

      {/* ================= Loading ================= */}

      {loading ? (
        <ProductLoader />
      ) : (
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-4">
            {/* ================= LEFT ================= */}

            <CCol lg={8}>
              {/* Basic Information */}

              <CCard className="border-0 shadow-sm mb-4">
                <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                  <h5 className="fw-bold mb-1">
                    Basic Information
                  </h5>

                  <small className="text-body-secondary">
                    Update the details of your product
                  </small>
                </CCardHeader>

                <CCardBody className="px-4 pb-4">
                  {/* Product Name */}

                  <div className="mb-4">
                    <CFormLabel className="fw-semibold">
                      Product Name
                    </CFormLabel>

                    <CFormInput
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="py-2"
                      required
                      disabled={updating}
                    />
                  </div>

                  {/* Description */}

                  <div className="mb-4">
                    <CFormLabel className="fw-semibold">
                      Description
                    </CFormLabel>

                    <CFormTextarea
                      rows={5}
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      placeholder="Write a detailed description for your product..."
                      className="py-2"
                      disabled={updating}
                    />
                  </div>

                  <CRow>
                    {/* Category */}

                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel className="fw-semibold">
                          Category
                        </CFormLabel>

                        <CFormSelect
                          name="category"
                          value={product.category}
                          onChange={handleChange}
                          className="py-2"
                          required
                          disabled={updating}
                        >
                          <option value="">
                            Select category
                          </option>

                          <option value="electronics">
                            Electronics
                          </option>

                          <option value="fashion">
                            Fashion
                          </option>

                          <option value="shoes">
                            Shoes
                          </option>

                          <option value="accessories">
                            Accessories
                          </option>
                        </CFormSelect>
                      </div>
                    </CCol>

                    {/* SKU */}

                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel className="fw-semibold">
                          SKU
                        </CFormLabel>

                        <CFormInput
                          type="text"
                          placeholder="e.g. PROD-001"
                          className="py-2"
                          disabled={updating}
                        />
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              {/* ================= Pricing ================= */}

              <CCard className="border-0 shadow-sm">
                <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                  <h5 className="fw-bold mb-1">
                    Pricing & Inventory
                  </h5>

                  <small className="text-body-secondary">
                    Set the product price and available stock
                  </small>
                </CCardHeader>

                <CCardBody className="px-4 pb-4">
                  <CRow>
                    {/* Price */}

                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel className="fw-semibold">
                          Price
                        </CFormLabel>

                        <CFormInput
                          type="number"
                          name="pricing"
                          value={product.pricing}
                          onChange={handleChange}
                          placeholder="₹ 0.00"
                          className="py-2"
                          min="0"
                          required
                          disabled={updating}
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
                          value={product.stockQuantity}
                          onChange={handleChange}
                          placeholder="Enter quantity"
                          className="py-2"
                          min="0"
                          required
                          disabled={updating}
                        />
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>

            {/* ================= RIGHT ================= */}

            <CCol lg={4}>
              {/* Product Image */}

              <CCard className="border-0 shadow-sm mb-4">
                <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                  <h5 className="fw-bold mb-1">
                    Product Image
                  </h5>

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
                      cursor: updating
                        ? "not-allowed"
                        : "pointer",
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
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="d-none"
                    onChange={handleImageChange}
                    disabled={updating}
                  />
                </CCardBody>
              </CCard>

              {/* Product Status */}

              <CCard className="border-0 shadow-sm">
                <CCardHeader className="bg-transparent border-0 px-4 pt-4">
                  <h5 className="fw-bold mb-1">
                    Product Status
                  </h5>

                  <small className="text-body-secondary">
                    Choose whether the product is visible
                  </small>
                </CCardHeader>

                <CCardBody className="px-4 pb-4">
                  <CFormSelect
                    name="status"
                    value={product.status}
                    onChange={handleChange}
                    className="py-2"
                    disabled={updating}
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </CFormSelect>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* ================= Bottom Actions ================= */}

          <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
            <CButton
              color="light"
              type="button"
              className="border"
              onClick={() => window.history.back()}
              disabled={updating}
            >
              Cancel
            </CButton>

            <CButton
              color="primary"
              type="submit"
              className="px-4"
              disabled={updating}
            >
              <CIcon
                icon={cilPlus}
                className="me-2"
              />

              {updating
                ? "Updating..."
                : "Update Product"}
            </CButton>
          </div>
        </CForm>
      )}

      {/* ================= SUCCESS MESSAGE ================= */}

      <Snackbar
        open={!!message}
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

      {/* ================= ERROR MESSAGE ================= */}

      <Snackbar
        open={!!errorMessage}
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
    </div>
  );
};

export default UpadteProduct;