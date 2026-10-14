import test from "node:test";
import assert from "node:assert/strict";
import shipOrder from "../src/models/Shiprocket/ShipOrder.js";
import { normalizeShiprocketTrackingStatus } from "../src/Services/MarketplaceShippingStatus.js";

test("Shiprocket shipment schema enforces one shipment per marketplace order and vendor", () => {
  const indexes = shipOrder.schema.indexes();
  assert.ok(indexes.some(([fields, options]) =>
    fields.orderId === 1 && fields.vendorId === 1 && options.unique === true,
  ));
});

test("normalizes provider delivery statuses for marketplace order progress", () => {
  assert.equal(normalizeShiprocketTrackingStatus("IN TRANSIT"), "SHIPPED");
  assert.equal(normalizeShiprocketTrackingStatus("Out For Delivery"), "SHIPPED");
  assert.equal(normalizeShiprocketTrackingStatus("DELIVERED"), "DELIVERED");
  assert.equal(normalizeShiprocketTrackingStatus("unknown provider state"), "");
});
