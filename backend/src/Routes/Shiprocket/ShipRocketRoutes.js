import express from "express";
import {
	getCustomerShipmentTracking,
	testCreateShiprocketOrder,
	testShiprocket,
} from "../../Controllers/Shiprocket/ShipRocketController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";

const router = express.Router();

router.get("/test", VendorAuthMiddleware, testShiprocket);
router.post("/test-create-order", VendorAuthMiddleware, testCreateShiprocketOrder);
router.get(
	"/shipments/:shipmentId/tracking",
	AuthMiddleware,
	getCustomerShipmentTracking,
);

export default router;