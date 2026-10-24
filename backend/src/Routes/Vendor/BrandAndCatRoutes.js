import express from "express";
import VendorAuth from "../../middlewares/VendorAuthMiddleware.js";
import upload from "../../middlewares/multer.js";
import {
  addBrand,
  deleteBrand,
  getBrands,
  updateBrand,
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../Controllers/Vendor/BrandAndCatController.js";
const router = express.Router();

router.post("/addBrand", upload.single("image"), VendorAuth, addBrand);
router.get("/getBrand", VendorAuth, getBrands);
router.put("/updateBrand/:id", VendorAuth, updateBrand);
router.delete("/deleteBrand/:id", VendorAuth, deleteBrand);

router.post("/addCategory", VendorAuth, addCategory);
router.get("/getCategory", VendorAuth, getCategories);
router.put("/updateCategory/:id", VendorAuth, updateCategory);
router.delete("/deleteCategory/:id", VendorAuth, deleteCategory);


export default router;