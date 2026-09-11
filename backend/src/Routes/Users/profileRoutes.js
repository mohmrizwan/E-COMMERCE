import express from "express";
import {
  addAddress,
  deleteAddress,
  getOrder,
  getProfile,
  updateAddress,
  updateProfile,
} from "../../Controllers/User/ProfileContoller.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
const router = express.Router();

router.get("/getProfile", AuthMiddleware, getProfile);
router.put("/updateProfile", AuthMiddleware, updateProfile);
router.get("/myOrder", AuthMiddleware, getOrder);
router.post("/address", AuthMiddleware, addAddress);
router.put("/address/:addressId", AuthMiddleware, updateAddress);
router.delete("/address/:addressId", AuthMiddleware, deleteAddress);

export default router;
