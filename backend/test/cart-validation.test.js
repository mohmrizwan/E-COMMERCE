import test from "node:test";
import assert from "node:assert/strict";
import {
  assertCartStockAvailable,
  normalizeCartItems,
} from "../src/utils/CartValidation.js";

const productId = "507f1f77bcf86cd799439011";

test("aggregates duplicate product rows before stock validation", () => {
  const normalized = normalizeCartItems([
    { productId, quantity: 3, price: 1 },
    { productId, quantity: 2, price: 1 },
  ]);

  assert.deepEqual(normalized, [{ productId, quantity: 5 }]);
  assert.throws(() => assertCartStockAvailable("Synthetic item", 5, 4), /enough stock/);
  assert.doesNotThrow(() => assertCartStockAvailable("Synthetic item", 5, 5));
});

test("rejects invalid IDs and quantities without relying on client prices", () => {
  assert.throws(
    () => normalizeCartItems([{ productId: "not-an-id", quantity: 1, price: 0 }]),
    /Invalid cart item/,
  );
  assert.throws(
    () => normalizeCartItems([{ productId, quantity: 0 }]),
    /Invalid cart item/,
  );
});
