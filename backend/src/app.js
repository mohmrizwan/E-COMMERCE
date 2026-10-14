import express from "express";
import cors from "cors";
import AuthUser from "./Routes/Users/AuthRoutes.js";
import profileRoutes from "./Routes/Users/profileRoutes.js";
import VendorRoutes from "./Routes/Vendor/AuthRoutes.js";
import ProductsRoutes from "./Routes/Vendor/ProductsRoutes.js";
import Product from "../../backend/src/Routes/Users/ProductRoutes.js";
import Payment from "../../backend/src/Routes/Users/PaymnetRoutes.js";
import Order from "../../backend/src/Routes/Users/OrderRoutes.js";
import VendorOrderRoutes from "./Routes/Vendor/OrderRoutes.js";
import shiprocketRoutes from "../../backend/src/Routes/Shiprocket/ShipRocketRoutes.js";
import TransactionRoutes from "./Routes/Vendor/TransactionRoutes.js";
import VendorIntegrationRoutes from "./Routes/Vendor/IntegrationRoutes.js";
import Dashboard from "../src/Routes/Vendor/Dashboard.js";
import StorefrontRoutes from "./Routes/Users/StorefrontRoutes.js";
export default function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });
  app.use(cors());
  app.use(express.json());

  app.use("/user", AuthUser);
  app.use("/profile", profileRoutes);
  app.use("/products", Product);
  app.use("/storefront", StorefrontRoutes);
  app.use("/payment", Payment);
  app.use("/order", Order);
  // vendor

  app.use("/shiprocket", shiprocketRoutes);
  app.use("/vendor", VendorRoutes);
  app.use("/vendor/integrations", VendorIntegrationRoutes);
  app.use("/vendor/products", ProductsRoutes);
  app.use("/vendor/orders", VendorOrderRoutes);
  app.use("/vendor/transactions", TransactionRoutes);
  app.use("/dashboard", Dashboard);

  return app;
}
