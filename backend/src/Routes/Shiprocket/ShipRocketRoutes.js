import express from "express";
import {
	getCustomerShipmentTracking,
	testCreateShiprocketOrder,
	testShiprocket,
} from "../../Controllers/Shiprocket/ShipRocketController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/test", testShiprocket);
router.post("/test-create-order", testCreateShiprocketOrder);
router.get(
	"/shipments/:shipmentId/tracking",
	AuthMiddleware,
	getCustomerShipmentTracking,
);

export default router;