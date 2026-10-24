import { useEffect, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useForm } from "react-hook-form";
import {
  addBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../../api/brands.js";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categories.js";
import Loader from "../ProductLoader.jsx";

const BrandAndCategoryManagement = () => {
  const [tab, setTab] = useState("categories");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isBrand = tab === "brands";
  const rows = isBrand ? brands : categories;
  const loading = isBrand ? brandsLoading : categoriesLoading;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      logo: null,
      status: "Active",
    },
  });

  const selectedLogo = watch("logo");

  const getToken = () => localStorage.getItem("vendorToken");

  const fetchBrands = async () => {
    setBrandsLoading(true);
    try {
      const list = await getBrands();
      setBrands(list);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not load brands.",
      );
    } finally {
      setBrandsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const list = await getCategories();
      setCategories(list);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not load categories.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const openAdd = () => {
    setEditing(null);
    reset({ name: "", logo: null, status: "Active" });
    setVisible(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      name: item.name || "",
      logo: null,
      status: item.status || "Active",
    });
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setEditing(null);
    reset({ name: "", logo: null, status: "Active" });
  };

  const addBrandItem = async (values) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Please login first.");
        return;
      }

      let logo = "";
      if (values.logo?.[0]) {
        logo = await fileToDataUrl(values.logo[0]);
      }

      if (!values.name?.trim()) {
        setErrorMessage("Brand name is required.");
        return;
      }
      if (!logo) {
        setErrorMessage("Brand logo is required.");
        return;
      }

      const response = await addBrand({
        name: values.name.trim(),
        logo,
      });
      setMessage(response?.message || "Brand added successfully.");
      await fetchBrands();
      closeModal();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not add brand.",
      );
    }
  };

  const updateBrandItem = async (values) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Please login first.");
        return;
      }

      const name = values.name?.trim() || editing?.name || "";
      let logo = editing?.logo || "";
      if (values.logo?.[0]) {
        logo = await fileToDataUrl(values.logo[0]);
      }

      const response = await updateBrand(editing.id, { name, logo });
      setMessage(response?.message || "Brand updated successfully.");
      await fetchBrands();
      closeModal();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not update brand.",
      );
    }
  };

  const deleteBrandItem = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) {
      return;
    }

    try {
      const response = await deleteBrand(item.id);
      setMessage(response?.message || "Brand deleted successfully.");
      await fetchBrands();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not delete brand.",
      );
    }
  };

  const addCategoryItem = async (values) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Please login first.");
        return;
      }

      if (!values.name?.trim()) {
        setErrorMessage("Category name is required.");
        return;
      }

      const response = await addCategory({
        name: values.name.trim(),
        status: values.status || "Active",
      });
      setMessage(response?.message || "Category added successfully.");
      await fetchCategories();
      closeModal();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not add category.",
      );
    }
  };

  const updateCategoryItem = async (values) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Please login first.");
        return;
      }

      const payload = {};
      if (values.name?.trim()) payload.name = values.name.trim();
      if (values.status) payload.status = values.status;

      const response = await updateCategory(editing.id, payload);
      setMessage(response?.message || "Category updated successfully.");
      await fetchCategories();
      closeModal();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not update category.",
      );
    }
  };

  const deleteCategoryItem = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) {
      return;
    }

    try {
      const response = await deleteCategory(item.id);
      setMessage(response?.message || "Category deleted successfully.");
      await fetchCategories();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Could not delete category.",
      );
    }
  };

  const addItem = async (values) => {
    setSaving(true);
    try {
      if (isBrand) {
        await addBrandItem(values);
      } else {
        await addCategoryItem(values);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (values) => {
    setSaving(true);
    try {
      if (isBrand) {
        await updateBrandItem(values);
      } else {
        await updateCategoryItem(values);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item) => {
    setSaving(true);
    try {
      if (isBrand) {
        await deleteBrandItem(item);
      } else {
        await deleteCategoryItem(item);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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
          sx={{ width: "100%", borderRadius: 2, boxShadow: 3, fontWeight: 600 }}
        >
          {message}
        </Alert>
      </Snackbar>
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
          sx={{ width: "100%", borderRadius: 2, boxShadow: 3, fontWeight: 600 }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className="container-fluid py-4">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Brand & Category Management</h2>

          <p className="text-body-secondary mb-0">
            Manage brands and categories used when adding products.
          </p>
        </div>

        <div className="d-flex gap-2 mb-3">
          <CButton
            color={tab === "categories" ? "primary" : "light"}
            onClick={() => setTab("categories")}
          >
            Categories
          </CButton>

          <CButton
            color={tab === "brands" ? "primary" : "light"}
            onClick={() => setTab("brands")}
          >
            Brands
          </CButton>
        </div>

        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>{isBrand ? "Brands" : "Categories"}</strong>

            <CButton color="primary" onClick={openAdd}>
              + Add {isBrand ? "Brand" : "Category"}
            </CButton>
          </CCardHeader>

          <CCardBody className="p-0">
            <div className="table-responsive">
              <CTable hover align="middle" className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>

                    {isBrand && <CTableHeaderCell>Logo</CTableHeaderCell>}

                    <CTableHeaderCell>
                      {isBrand ? "Brand Name" : "Category Name"}
                    </CTableHeaderCell>

                    {!isBrand && <CTableHeaderCell>Status</CTableHeaderCell>}

                    <CTableHeaderCell className="text-end">
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {loading && (
                    <CTableRow>
                      <CTableDataCell
                        colSpan={4}
                        className="text-center text-body-secondary py-5"
                      >
                        <Loader />
                      </CTableDataCell>
                    </CTableRow>
                  )}

                  {!loading &&
                    rows.map((item, index) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>

                        {isBrand && (
                          <CTableDataCell>
                            {item.logo ? (
                              <img
                                src={item.logo}
                                alt={item.name}
                                style={{
                                  width: 64,
                                  height: 40,
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <span className="text-body-secondary">
                                No logo
                              </span>
                            )}
                          </CTableDataCell>
                        )}

                        <CTableDataCell className="fw-semibold">
                          {item.name}
                        </CTableDataCell>

                        {!isBrand && (
                          <CTableDataCell>
                            <CBadge color="success">{item.status}</CBadge>
                          </CTableDataCell>
                        )}

                        <CTableDataCell>
                          <div className="d-flex justify-content-end gap-2">
                            <CButton
                              size="sm"
                              color="info"
                              variant="outline"
                              onClick={() => openEdit(item)}
                            >
                              Edit
                            </CButton>

                            <CButton
                              size="sm"
                              color="danger"
                              variant="outline"
                              onClick={() => deleteItem(item)}
                            >
                              Delete
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}

                  {!loading && rows.length === 0 && (
                    <CTableRow>
                      <CTableDataCell
                        colSpan={4}
                        className="text-center text-body-secondary py-5"
                      >
                        No {isBrand ? "brands" : "categories"} added yet.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>

        <CModal visible={visible} onClose={closeModal} alignment="center">
          <form
            onSubmit={handleSubmit(editing ? updateItem : addItem)}
            noValidate
          >
            <CModalHeader>
              <CModalTitle>
                {editing ? "Edit" : "Add"} {isBrand ? "Brand" : "Category"}
              </CModalTitle>
            </CModalHeader>

            <CModalBody>
              <div className="mb-3">
                <CFormLabel htmlFor="item-name">
                  {isBrand ? "Brand Name" : "Category Name"}
                </CFormLabel>

                <CFormInput
                  id="item-name"
                  placeholder={isBrand ? "e.g. Milton" : "e.g. Bottles"}
                  invalid={Boolean(errors.name)}
                  {...register("name", {
                    validate: (value) => {
                      if (!editing && !value?.trim()) {
                        return "Name is required";
                      }
                      if (value && value.trim().length < 2) {
                        return "Enter at least 2 characters";
                      }
                      return true;
                    },
                  })}
                />

                {errors.name && (
                  <div className="text-danger small mt-1">
                    {errors.name.message}
                  </div>
                )}
              </div>

              {isBrand && (
                <div className="mb-2">
                  <CFormLabel htmlFor="brand-logo">
                    Brand Logo {editing ? "(Optional)" : "(Required)"}
                  </CFormLabel>

                  <CFormInput
                    id="brand-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    {...register("logo", {
                      validate: (files) => {
                        if (!editing && (!files || !files[0])) {
                          return "Logo is required";
                        }
                        return true;
                      },
                    })}
                  />

                  {errors.logo && (
                    <div className="text-danger small mt-1">
                      {errors.logo.message}
                    </div>
                  )}
                  {selectedLogo?.[0] && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(selectedLogo[0])}
                        alt="Logo Preview"
                        style={{
                          maxWidth: 140,
                          maxHeight: 80,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}

                  {!selectedLogo?.[0] && editing?.logo && (
                    <div className="mt-3">
                      <img
                        src={editing.logo}
                        alt="Current Brand Logo"
                        style={{
                          maxWidth: 140,
                          maxHeight: 80,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {!isBrand && (
                <div className="mb-3">
                  <CFormLabel htmlFor="category-status">Status</CFormLabel>
                  <CFormInput
                    id="category-status"
                    placeholder="e.g. Active"
                    {...register("status")}
                  />
                </div>
              )}
            </CModalBody>

            <CModalFooter>
              <CButton
                color="secondary"
                variant="outline"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </CButton>

              <CButton color="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update" : "Add"}
              </CButton>
            </CModalFooter>
          </form>
        </CModal>
      </div>
    </>
  );
};

export default BrandAndCategoryManagement;
