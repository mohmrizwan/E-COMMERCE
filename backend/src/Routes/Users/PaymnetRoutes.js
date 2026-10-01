import express from "express";
import { order, verify } from "../../Controllers/User/PayemntController.js";
const router = express.Router();

router.post("/get-payment", order);
router.post("/verify", verify);

export default router;
