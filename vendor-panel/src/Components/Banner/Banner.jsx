import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config/api.js";
import {
  CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput,
  CFormLabel, CFormSelect, CFormTextarea, CImage, CRow, CSpinner,
} from "@coreui/react";

const initialForm = { title: "", highlighted: "", productId: "", buttonText: "Shop Now" };
const imageTypes = ["image/png", "image/jpeg", "image/webp"];

const VendorBannerForm = () => {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(apiUrl("vendor/products/getAllProducts"), { headers }),
      axios.get(apiUrl("vendor/banner"), { headers }),
    ]).then(([productResponse, bannerResponse]) => {
      const list = (productResponse.data.products || []).filter((product) => product.status === "active");
      const savedBanners = bannerResponse.data.banners || [];
      setProducts(list);
      setBanners(savedBanners);
      setPreview("");
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || "Could not load banner details and products.");
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const selectedProduct = products.find((product) => product._id === form.productId);
  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [event.target.name]: "" }));
    setSuccess("");
  };

  const chooseImage = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (!imageTypes.includes(nextFile.type)) {
      setFieldErrors((current) => ({ ...current, image: "Choose a PNG, JPG or WebP image." }));
      event.target.value = "";
      return;
    }
    if (nextFile.size > 5 * 1024 * 1024) {
      setFieldErrors((current) => ({ ...current, image: "Image size must be 5 MB or less." }));
      event.target.value = "";
      return;
    }
    setFile(nextFile);
    setFieldErrors((current) => ({ ...current, image: "" }));
    setSuccess("");
  };

  const deleteBanner = async (bannerId) => {
    try {
      const token = localStorage.getItem("vendorToken");
      await axios.delete(apiUrl(`vendor/banner/${bannerId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners((current) => current.filter((item) => item._id !== bannerId));
      setSuccess("Banner deleted successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete banner.");
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Banner title is required.";
    if (!form.highlighted.trim()) nextErrors.highlighted = "Highlighted text is required.";
    if (!form.productId) nextErrors.productId = "Select a product.";
    if (!file) nextErrors.image = "Choose a banner image.";
    if (!form.buttonText.trim()) nextErrors.buttonText = "Button text is required.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true); setError(""); setSuccess("");
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("highlighted", form.highlighted);
      payload.append("productId", form.productId);
      payload.append("buttonText", form.buttonText);
      if (file) payload.append("image", file);
      const token = localStorage.getItem("vendorToken");
      const response = await axios.post(apiUrl("vendor/banner"), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners((current) => [response.data.banner, ...current]);
      setForm(initialForm);
      setFile(null);
      setPreview("");
      setSuccess(response.data.message || "Banner saved successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save banner. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="d-flex align-items-center gap-2 py-5"><CSpinner size="sm" /> Loading banner configuration…</div>;

  return <CRow className="g-4">
    <CCol xs={12} lg={7}>
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-transparent border-0 px-4 pt-4"><h4 className="fw-bold mb-1">Promote Your Product</h4><p className="text-body-secondary mb-0">Configure the banner shown in your storefront.</p></CCardHeader>
        <CCardBody className="p-4">
          {error && <CAlert color="danger" dismissible onClose={() => setError("")}>{error}</CAlert>}
          {success && <CAlert color="success" dismissible onClose={() => setSuccess("")}>{success}</CAlert>}
          {!products.length && <CAlert color="warning">Add a product before configuring a banner.</CAlert>}
          <CForm onSubmit={submit} noValidate>
            <div className="mb-3"><CFormLabel htmlFor="banner-title">Banner Title *</CFormLabel><CFormInput id="banner-title" name="title" value={form.title} onChange={update} invalid={Boolean(fieldErrors.title)} />{fieldErrors.title && <div className="text-danger small mt-1">{fieldErrors.title}</div>}</div>
            <div className="mb-3"><CFormLabel htmlFor="banner-highlighted">Highlighted Text *</CFormLabel><CFormTextarea id="banner-highlighted" name="highlighted" rows={2} value={form.highlighted} onChange={update} invalid={Boolean(fieldErrors.highlighted)} />{fieldErrors.highlighted && <div className="text-danger small mt-1">{fieldErrors.highlighted}</div>}</div>
            <div className="mb-3"><CFormLabel htmlFor="banner-image">Banner Image *</CFormLabel><CFormInput id="banner-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} invalid={Boolean(fieldErrors.image)} /><div className="form-text">PNG, JPG or WebP. Maximum size: 5 MB. Leave empty to keep the current image.</div>{fieldErrors.image && <div className="text-danger small mt-1">{fieldErrors.image}</div>}</div>
            <div className="mb-3"><CFormLabel htmlFor="banner-product">Product *</CFormLabel><CFormSelect id="banner-product" name="productId" value={form.productId} onChange={update} invalid={Boolean(fieldErrors.productId)} disabled={!products.length}><option value="">Select one of your products</option>{products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}</CFormSelect>{fieldErrors.productId && <div className="text-danger small mt-1">{fieldErrors.productId}</div>}</div>
            {selectedProduct && <div className="mb-3"><CFormLabel>Product page</CFormLabel><div className="form-control bg-light text-body-secondary">/product/{selectedProduct._id}</div></div>}
            <div className="mb-4"><CFormLabel htmlFor="banner-button-text">Button Text *</CFormLabel><CFormInput id="banner-button-text" name="buttonText" value={form.buttonText} onChange={update} invalid={Boolean(fieldErrors.buttonText)} />{fieldErrors.buttonText && <div className="text-danger small mt-1">{fieldErrors.buttonText}</div>}</div>
            <CButton type="submit" color="primary" disabled={saving || !products.length}>{saving && <CSpinner size="sm" className="me-2" />}{saving ? "Saving…" : "Save Banner"}</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
     <CCol xs={12} lg={5}><h5 className="fw-bold mb-3">Banner Preview</h5><CCard className="overflow-hidden border-0 shadow-sm">{preview ? <CImage src={preview} alt="Banner preview" className="w-100" style={{ height: 220, objectFit: "cover" }} /> : <div className="d-flex align-items-center justify-content-center bg-light text-body-secondary" style={{ height: 220 }}>Choose an image to preview your banner</div>}<CCardBody className="p-4"><h4 className="fw-bold">{form.title || "Your Banner Title"}</h4><p className="text-body-secondary">{form.highlighted || "Your highlighted message will appear here."}</p><CButton color="primary" disabled={!selectedProduct}>{form.buttonText || "Shop Now"}</CButton></CCardBody></CCard></CCol>
     <CCol xs={12}>
       <CCard className="border-0 shadow-sm">
         <CCardHeader className="bg-transparent border-0 px-4 pt-4"><h5 className="fw-bold mb-1">Saved Banners</h5><p className="text-body-secondary mb-0">All banners shown in your storefront swiper.</p></CCardHeader>
         <CCardBody className="p-4">
           {!banners.length && <p className="text-body-secondary mb-0">No banners saved yet.</p>}
           <div className="d-flex flex-column gap-3">
             {banners.map((savedBanner) => (
               <div key={savedBanner._id} className="d-flex align-items-center gap-3 border rounded p-2">
                 <CImage src={savedBanner.image} alt={savedBanner.title} style={{ width: 96, height: 64, objectFit: "cover" }} />
                 <div className="flex-grow-1">
                   <div className="fw-bold">{savedBanner.title}</div>
                   <div className="text-body-secondary small">{savedBanner.highlighted}</div>
                 </div>
                 <CButton color="danger" variant="outline" size="sm" onClick={() => deleteBanner(savedBanner._id)}>Delete</CButton>
               </div>
             ))}
           </div>
         </CCardBody>
       </CCard>
     </CCol>
   </CRow>;
};

export default VendorBannerForm;
