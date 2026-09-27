import express from "express";
import cors from "cors";

import AuthUser from "./Routes/Users/AuthRoutes.js";
import profileRoutes from "./Routes/Users/profileRoutes.js";
import VendorRoutes from "./Routes/Vendor/AuthRoutes.js";
import ProductsRoutes from "./Routes/Vendor/ProductsRoutes.js";
import Product from "../../backend/src/Routes/Users/ProductRoutes.js";

export default function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/user", AuthUser);
  app.use("/profile", profileRoutes);
  app.use("/products", Product);

  // vendor

  app.use("/vendor", VendorRoutes);
  app.use("/vendor/products", ProductsRoutes);

  return app;
}
