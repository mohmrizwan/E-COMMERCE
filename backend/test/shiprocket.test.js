import test from "node:test";
import assert from "node:assert/strict";
import { testCreateShiprocketOrder } from "../src/Controllers/Shiprocket/ShipRocketController.js";

test("legacy Shiprocket test-create-order endpoint is disabled without calling Shiprocket", async () => {
  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await testCreateShiprocketOrder(
    { body: { order_id: "synthetic-untrusted-order" }, vendor: { _id: "synthetic-vendor" } },
    response,
  );

  assert.equal(response.statusCode, 410);
  assert.equal(response.body.success, false);
});
