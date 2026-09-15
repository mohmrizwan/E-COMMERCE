import express from "express";
const router = express.Router();
import { registerVendor } from "../../Controllers/Vendor/AuthControllers.js";

router.post("/register", registerVendor);

export default router;
