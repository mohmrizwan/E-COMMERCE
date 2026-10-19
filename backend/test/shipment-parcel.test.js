import test from "node:test";
import assert from "node:assert/strict";
import { calculateShipmentParcel } from "../src/Services/ShipmentParcel.js";

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
