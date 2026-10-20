import test from "node:test";
import assert from "node:assert/strict";
import { getMongoConnectionString } from "../src/database/dbConnect.js";
import {
  getShiprocketEnvironmentCredentials,
  resolveShiprocketCredentials,
} from "../src/Services/ShiprocketCredentials.js";
import {
  authenticateShiprocketCredentials,
  selectShiprocketCourierQuote,
} from "../src/Services/ShipRocket.js";

test("MongoDB connection configuration requires a MongoDB URI scheme", () => {
  assert.equal(
    getMongoConnectionString({ MONGODB_URI: " mongodb+srv://db.example/shop " }),
    "mongodb+srv://db.example/shop",
  );
  assert.throws(() => getMongoConnectionString({}), /MONGODB_URI must start with/);
  assert.throws(() => getMongoConnectionString({ MONGODB_URI: "db.example/shop" }), /MONGODB_URI must start with/);
});

test("Shiprocket environment credentials require a pair and take precedence", () => {
  assert.equal(getShiprocketEnvironmentCredentials({}), null);
  assert.deepEqual(
    getShiprocketEnvironmentCredentials({
      SHIPROCKET_EMAIL: " API@EXAMPLE.COM ",
      SHIPROCKET_PASSWORD: "private-password",
    }),
    { email: "api@example.com", password: "private-password" },
  );
  assert.throws(
    () => getShiprocketEnvironmentCredentials({ SHIPROCKET_EMAIL: "api@example.com" }),
    /must be configured together/,
  );
  assert.deepEqual(
    resolveShiprocketCredentials({
      environmentCredentials: { email: "env@example.com", password: "env-password" },
      storedCredentials: { email: "stored@example.com", password: "stored-password" },
    }),
    { email: "env@example.com", password: "env-password" },
  );
  assert.deepEqual(
    resolveShiprocketCredentials({
      storedCredentials: { email: "stored@example.com", password: "stored-password" },
    }),
    { email: "stored@example.com", password: "stored-password" },
  );
  assert.throws(() => resolveShiprocketCredentials({}), /not configured/);
});

test("Shiprocket authentication surfaces provider rejection without credentials in the error", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    await assert.rejects(
      authenticateShiprocketCredentials(
        { email: "api@example.com", password: "private-password" },
        { post: async () => { throw Object.assign(new Error("rejected"), { response: { status: 401 } }); } },
      ),
      (error) => error.message === "rejected" && !error.message.includes("private-password"),
    );
  } finally {
    console.error = originalConsoleError;
  }
});

test("Shiprocket quote rejects unusable serviceability rates and selects the lowest valid rate", () => {
  assert.throws(
    () => selectShiprocketCourierQuote({ available_courier_companies: [{ courier_company_id: 4, rate: "n/a" }] }),
    /no serviceable couriers with valid rates/,
  );
  assert.deepEqual(
    selectShiprocketCourierQuote({
      available_courier_companies: [
        { courier_company_id: 4, rate: 75, courier_name: "Courier A" },
        { courier_company_id: 5, rate: 52.5, courier_name: "Courier B", etd: "2 days" },
      ],
    }, "", { pickupPostcode: "110001" }),
    {
      shippingAmount: 52.5,
      courierCompanyId: "5",
      courierName: "Courier B",
      estimatedDelivery: "2 days",
      pickupPostcode: "110001",
    },
  );
});
