import express from "express";
import { order, quote, verify } from "../../Controllers/User/PayemntController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
const router = express.Router();

router.post("/get-payment", AuthMiddleware, order);
router.post("/quote", AuthMiddleware, quote);
router.post("/verify", AuthMiddleware, verify);

export default router;
