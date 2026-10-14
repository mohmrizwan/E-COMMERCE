import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRouteTransferAllocations,
  RouteTransferConfigurationError,
} from "../src/Services/RouteTransferAllocation.js";

test("allocates one transfer per vendor from persisted item and shipping totals", () => {
  const allocations = buildRouteTransferAllocations({
    vendorSubtotalsPaise: new Map([["vendor-a", 25000], ["vendor-b", 10000]]),
    vendorShippingQuotes: [
      { vendorId: "vendor-a", shippingAmount: 50 },
      { vendorId: "vendor-b", shippingAmount: 25 },
    ],
    vendorConfigs: new Map([
      ["vendor-a", { enabled: true, linkedAccountId: "acc_A123" }],
      ["vendor-b", { enabled: true, linkedAccountId: "acc_B456" }],
    ]),
    orderAmountPaise: 42500,
  });

  assert.deepEqual(allocations.map(({ linkedAccountId, amountPaise }) => ({ linkedAccountId, amountPaise })), [
    { linkedAccountId: "acc_A123", amountPaise: 30000 },
    { linkedAccountId: "acc_B456", amountPaise: 12500 },
  ]);
});

test("rejects missing or unapproved linked accounts", () => {
  assert.throws(() => buildRouteTransferAllocations({
    vendorSubtotalsPaise: new Map([["vendor-a", 10000]]),
    vendorShippingQuotes: [],
    vendorConfigs: new Map([["vendor-a", { enabled: false, linkedAccountId: "acc_A123" }]]),
    orderAmountPaise: 10000,
  }), RouteTransferConfigurationError);
});

test("rejects any allocation total that differs from the customer order total", () => {
  assert.throws(() => buildRouteTransferAllocations({
    vendorSubtotalsPaise: new Map([["vendor-a", 10000]]),
    vendorShippingQuotes: [],
    vendorConfigs: new Map([["vendor-a", { enabled: true, linkedAccountId: "acc_A123" }]]),
    orderAmountPaise: 10001,
  }), RouteTransferConfigurationError);
});
