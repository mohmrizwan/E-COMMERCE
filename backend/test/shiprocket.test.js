import test from "node:test";
import assert from "node:assert/strict";
import { testCreateShiprocketOrder } from "../src/Controllers/Shiprocket/ShipRocketController.js";
import {
  matchShiprocketOrderReference,
  normalizeShiprocketOrderDetails,
} from "../src/Services/ShipRocket.js";

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

test("Shiprocket reconciliation matches exact merchant references only", () => {
  const results = matchShiprocketOrderReference(
    [
      { id: 12, channel_order_id: "order-a" },
      { id: 13, channel_order_id: "order-ab" },
    ],
    "order-a",
  );
  assert.deepEqual(results.map((order) => order.id), [12]);
});

test("normalizes an existing Shiprocket order and shipment for local reconciliation", () => {
  assert.deepEqual(
    normalizeShiprocketOrderDetails({
      data: {
        id: 12,
        shipments: [{ id: 34, awb: "awb-123", courier_company_id: 7, courier: "Courier" }],
      },
    }),
    {
      orderId: "12",
      shipmentId: "34",
      awbCode: "awb-123",
      courierCompanyId: "7",
      courierName: "Courier",
    },
  );
});
