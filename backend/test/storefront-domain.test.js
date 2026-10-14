import test from "node:test";
import assert from "node:assert/strict";
import { normalizeStorefrontHost } from "../src/Services/StorefrontDomain.js";

test("normalizes a valid host and removes its port", () => {
  assert.equal(normalizeStorefrontHost("ShopA.VendoraFlame.com:443"), "shopa.vendoraflame.com");
});

test("rejects missing, malformed, and forwarded host lists", () => {
  assert.equal(normalizeStorefrontHost(""), "");
  assert.equal(normalizeStorefrontHost("shop.example, attacker.example"), "");
  assert.equal(normalizeStorefrontHost("https://shop.example/path"), "");
});
