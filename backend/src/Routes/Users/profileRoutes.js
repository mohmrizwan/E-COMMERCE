import express from "express";
import {
  getOrder,
  getProfile,
  updateProfile,
} from "../../Controllers/User/ProfileContoller.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
const router = express.Router();

router.get("/getProfile", AuthMiddleware, getProfile);
router.put("/updateProfile", AuthMiddleware, updateProfile);
router.get("/myOrder", AuthMiddleware, getOrder);

export default router;
