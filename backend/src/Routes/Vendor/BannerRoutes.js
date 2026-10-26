import express from "express";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import upload from "../../middlewares/multer.js";
import { getBanners, saveBanner, deleteBanner } from "../../Controllers/Vendor/Banner.js";

const router = express.Router();
router.get("/", VendorAuthMiddleware, getBanners);
router.post("/", VendorAuthMiddleware, (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      const message = error.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : error.message;
      return res.status(400).json({ message });
    }
    next();
  });
}, saveBanner);
router.delete("/:id", VendorAuthMiddleware, deleteBanner);

export default router;
