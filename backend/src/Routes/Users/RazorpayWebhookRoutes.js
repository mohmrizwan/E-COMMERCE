import express from "express";
import { handleRazorpayWebhook } from "../../Controllers/User/RazorpayWebhookController.js";

const router = express.Router();
router.post("/", handleRazorpayWebhook);

export default router;
