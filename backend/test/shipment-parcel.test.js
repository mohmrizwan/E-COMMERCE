import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateShipmentParcel,
  calculateVendorMerchandiseValue,
  formatServiceabilityParcel,
} from "../src/Services/ShipmentParcel.js";

test("shipment parcel totals weight and stacks product quantities in centimeters", () => {
  const parcel = calculateShipmentParcel([
    { productId: { name: "A", weight: 0.4, length: 20, breadth: 10, height: 5 }, quantity: 2 },
    { productId: { name: "B", weight: 0.25, length: 15, breadth: 12, height: 8 }, quantity: 1 },
  ]);

  assert.deepEqual(parcel, { weight: 1.05, length: 20, breadth: 12, height: 18 });
});

test("legacy products without complete dimensions cannot be quoted silently", () => {
  assert.throws(
    () => calculateShipmentParcel([
      { productId: { name: "Legacy item", weight: 0.2, length: 10, breadth: 0, height: 2 }, quantity: 1 },
    ]),
    /Legacy item requires valid breadth/,
  );
});

test("serviceability dimensions round up to documented whole centimeters while weight stays in kg", () => {
  assert.deepEqual(
    formatServiceabilityParcel({ weight: 1.125, length: 10.01, breadth: 9, height: 4.4 }),
    { weight: 1.125, length: 11, breadth: 9, height: 5 },
  );
  assert.throws(() => formatServiceabilityParcel({ weight: 0, length: 2, breadth: 2, height: 2 }), /weight/i);
  assert.throws(() => formatServiceabilityParcel({ weight: 1, length: 0.5, breadth: 2, height: 2 }), /length/i);
});

test("vendor declared value uses its server-priced merchandise and excludes shipping", () => {
  const order = {
    shippingAmount: 400,
    totalAmount: 2500,
    items: [
      { vendorId: "vendor-a", price: 80, quantity: 2 },
      { vendorId: "vendor-b", price: 100, quantity: 3 },
    ],
  };
  assert.equal(calculateVendorMerchandiseValue(order, "vendor-a"), 160);
  assert.equal(calculateVendorMerchandiseValue(order, "vendor-b"), 300);
  assert.throws(() => calculateVendorMerchandiseValue(order, "vendor-c"), /no merchandise/i);
});
