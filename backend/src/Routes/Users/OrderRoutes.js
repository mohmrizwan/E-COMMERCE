import experss from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { createOrder } from "../../Controllers/User/OrderController.js";4

const router = experss.Router();

router.post("/createOrder", AuthMiddleware, createOrder);
// router.get("/getOrders", AuthMiddleware, );

export default router;