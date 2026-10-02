import express from "express";
import {
	acceptOrder,
	assignCourier,
	getAvailableCouriers,
	getMyOrders,
	getVendorShipmentTracking,
	markOrderProcessing,
	shipVendorOrder,
} from "../../Controllers/Vendor/MyOrders.js";
import VendorAuthMiddleware from "../../middlewares/VendorAuthMiddleware.js";
const router = express.Router();

router.get("/myOrders", VendorAuthMiddleware, getMyOrders);
router.patch("/accept/:orderId", VendorAuthMiddleware, acceptOrder);
router.get(
	"/shipments/:shipOrderId/couriers",
	VendorAuthMiddleware,
	getAvailableCouriers,
);
router.patch(
	"/shipments/:shipOrderId/courier",
	VendorAuthMiddleware,
	assignCourier,
);
router.patch("/processing/:orderId", VendorAuthMiddleware, markOrderProcessing);
router.post("/ship/:orderId", VendorAuthMiddleware, shipVendorOrder);
router.get(
	"/shipments/:shipmentId/tracking",
	VendorAuthMiddleware,
	getVendorShipmentTracking,
);

export default router;
