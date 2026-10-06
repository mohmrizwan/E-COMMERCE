import express from "express";
// import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
import {

  myCustomer,
} from "../../Controllers/Vendor/MyCustomer.js";

const router = express.Router();

router.get("/myCustomers", VendorAuthMiddleware, myCustomer);

export default router;

// AuthMiddleware, VendorAuthMiddleware, myCustomer
