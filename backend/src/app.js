import express from "express";
import cors from "cors";

import AuthUser from "./Routes/Users/AuthRoutes.js";
import profileRoutes from "../src/Routes//Users/profileRoutes.js";
import VendorRoutes from "../src/Routes/Vendor/AuthRoutes.js";

export default function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/user", AuthUser);
  app.use("/profile", profileRoutes);

  // vendor

  app.use("/vendor", VendorRoutes);

  return app;
}
