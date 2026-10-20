import test from "node:test";
import assert from "node:assert/strict";
import {
  getEligibleOrderItemsForShipment,
  isStaleCreatingReservation,
  reconcileShipmentReservation,
  saveShipmentReservationForPaidOrder,
  SHIPROCKET_CREATING_STALE_AFTER_MS,
  validateShiprocketCourierAssignment,
  validateShiprocketPickupResponse,
} from "../src/Services/ShiprocketShipmentSafety.js";

const ownerId = "store-owner-id";
const now = Date.now();

test("shipment eligibility rejects unpaid, failed, cancelled, and non-owner orders before reservation or provider work", async () => {
  const paidOrder = { status: "Pending", paymentStatus: "Paid", items: [{ vendorId: ownerId }] };
  assert.deepEqual(getEligibleOrderItemsForShipment(paidOrder, ownerId), paidOrder.items);
  for (const [name, order, expected] of [
    ["unpaid", { ...paidOrder, paymentStatus: "Pending" }, /Only paid orders/],
    ["failed", { ...paidOrder, paymentStatus: "Failed" }, /Only paid orders/],
    ["cancelled", { ...paidOrder, status: "Cancelled" }, /cannot be accepted/],
    ["foreign-owner", { ...paidOrder, items: [{ vendorId: "other" }] }, /not authorized/],
  ]) {
    let reservationWrites = 0;
    let providerRequests = 0;
    const reservation = { async save() { reservationWrites += 1; } };
    await assert.rejects((async () => {
      await saveShipmentReservationForPaidOrder({ order, vendorId: ownerId, reservation });
      providerRequests += 1;
    })(), expected, name);
    assert.equal(reservationWrites, 0, `${name} must not reserve shipment`);
    assert.equal(providerRequests, 0, `${name} must not reach provider call`);
  }

  let paidReservationWrites = 0;
  await saveShipmentReservationForPaidOrder({
    order: paidOrder,
    vendorId: ownerId,
    reservation: { async save() { paidReservationWrites += 1; } },
  });
  assert.equal(paidReservationWrites, 1);
});

test("Shiprocket AWB assignment records the courier returned by the provider", () => {
  const response = {
    awb_assign_status: 1,
    response: { data: { courier_company_id: 142, awb_code: "awb-test", shipment_id: 9001 } },
  };
  assert.deepEqual(validateShiprocketCourierAssignment(response, "24"), {
    courier_company_id: "142",
    awb_code: "awb-test",
    shipment_id: 9001,
  });
  assert.throws(
    () => validateShiprocketCourierAssignment({ ...response, response: { data: { awb_code: "awb-test" } } }),
    /incomplete courier\/AWB/,
  );
  assert.throws(() => validateShiprocketCourierAssignment({ ...response, awb_assign_status: 0 }), /incomplete courier\/AWB/);
});

test("pickup status advances on the documented success flag when optional details are absent", () => {
  assert.equal(validateShiprocketPickupResponse({
    pickup_status: 1,
    response: { pickup_scheduled_date: "2026-10-22 12:00:00", pickup_token_number: "pickup-ref" },
  }), true);
  assert.equal(validateShiprocketPickupResponse({ pickup_status: 1, response: {} }), true);
  assert.equal(validateShiprocketPickupResponse({ pickup_status: 1, response: { errors: [] } }), true);
  assert.equal(validateShiprocketPickupResponse({ pickup_status: 1 }), true);
  assert.equal(validateShiprocketPickupResponse({ pickup_status: 0, response: { pickup_scheduled_date: "tomorrow" } }), false);
  assert.equal(validateShiprocketPickupResponse({ status: true, response: { pickup_scheduled_date: "tomorrow" } }), false);
  assert.equal(validateShiprocketPickupResponse({ pickup_status: 1, response: { error: "pickup failed" } }), false);
  assert.equal(validateShiprocketPickupResponse(null), false);
});

const makeReservation = (overrides = {}) => ({
  _id: "reservation-id",
  orderId: "local-order-id",
  vendorId: ownerId,
  status: "CREATING",
  createdAt: new Date(now - SHIPROCKET_CREATING_STALE_AFTER_MS - 1),
  updatedAt: new Date(now - SHIPROCKET_CREATING_STALE_AFTER_MS - 1),
  shiprocketOrderId: "",
  shiprocketShipmentId: "",
  awbCode: "",
  ...overrides,
});

const makeShipmentModel = (reservation) => ({
  async findOneAndUpdate(filter, update) {
    if (
      String(filter._id) !== String(reservation._id) ||
      String(filter.vendorId) !== String(reservation.vendorId) ||
      filter.status !== reservation.status
    ) return null;
    if (filter.updatedAt?.$lte && reservation.updatedAt > filter.updatedAt.$lte) return null;
    Object.assign(reservation, update.$set);
    return reservation;
  },
  async findById(id) { return String(id) === String(reservation._id) ? reservation : null; },
});

test("fresh CREATING reservations are not reconciled yet", async () => {
  const reservation = makeReservation({ updatedAt: new Date(now - 1000) });
  let lookupCalls = 0;
  const result = await reconcileShipmentReservation({
    Shipment: makeShipmentModel(reservation),
    shipment: reservation,
    vendorId: ownerId,
    orderReference: "local-order-id",
    lookupOrder: async () => { lookupCalls += 1; return {}; },
    now,
  });
  assert.equal(result.state, "still_creating");
  assert.equal(lookupCalls, 0);
  assert.equal(reservation.status, "CREATING");
});

test("stale reservations reconcile a uniquely found Shiprocket order", async () => {
  const reservation = makeReservation();
  const result = await reconcileShipmentReservation({
    Shipment: makeShipmentModel(reservation),
    shipment: reservation,
    vendorId: ownerId,
    orderReference: "local-order-id",
    lookupOrder: async (reference) => {
      assert.equal(reference, "local-order-id");
      return { matchCount: 1, shipment: { orderId: "shiprocket-order-id", shipmentId: "shipment-id", awbCode: "awb", courierCompanyId: "24", courierName: "Courier" } };
    },
    now,
  });
  assert.equal(result.state, "found");
  assert.equal(reservation.status, "AWB_ASSIGNED");
  assert.equal(reservation.shiprocketShipmentId, "shipment-id");
  assert.equal(reservation.courierCompanyId, "24");
});

test("missing, ambiguous, and failed lookups leave reservations explicitly unresolved", async (t) => {
  for (const [name, lookupOrder, lookupFailed] of [
    ["missing", async () => ({ matchCount: 0, shipment: null }), false],
    ["ambiguous", async () => ({ matchCount: 2, shipment: null }), false],
    ["failed", async () => { throw new Error("synthetic lookup failure"); }, true],
  ]) {
    await t.test(name, async () => {
      const reservation = makeReservation();
      const result = await reconcileShipmentReservation({
        Shipment: makeShipmentModel(reservation),
        shipment: reservation,
        vendorId: ownerId,
        orderReference: "local-order-id",
        lookupOrder,
        now,
      });
      assert.equal(result.state, "unresolved");
      assert.equal(result.lookupFailed || false, lookupFailed);
      assert.equal(reservation.status, "CREATION_UNKNOWN");
      assert.equal(reservation.shiprocketShipmentId, "");
    });
  }
});

test("concurrent stale recovery attempts cannot overwrite an already reconciled shipment", async () => {
  const reservation = makeReservation();
  const Shipment = makeShipmentModel(reservation);
  let lookupCalls = 0;
  const lookupOrder = async () => {
    lookupCalls += 1;
    await new Promise((resolve) => setImmediate(resolve));
    return { matchCount: 1, shipment: { orderId: "provider-order", shipmentId: "provider-shipment", awbCode: "awb", courierCompanyId: "24" } };
  };
  const results = await Promise.all([1, 2].map(() => reconcileShipmentReservation({
    Shipment,
    shipment: { ...reservation },
    vendorId: ownerId,
    orderReference: "local-order-id",
    lookupOrder,
    now,
  })));
  assert.equal(lookupCalls, 2);
  assert.equal(reservation.status, "AWB_ASSIGNED");
  assert.equal(reservation.shiprocketShipmentId, "provider-shipment");
  assert.ok(results.every((result) => ["found", "already_changed"].includes(result.state)));
});

test("a concurrent reconciliation does not reset a reservation another worker resolved", async () => {
  const reservation = makeReservation();
  const staleCopy = { ...reservation };
  const Shipment = makeShipmentModel(reservation);
  const first = await reconcileShipmentReservation({
    Shipment,
    shipment: reservation,
    vendorId: ownerId,
    orderReference: "local-order-id",
    lookupOrder: async () => ({ matchCount: 1, shipment: { orderId: "provider-order", shipmentId: "provider-shipment" } }),
    now,
  });
  const second = await reconcileShipmentReservation({
    Shipment,
    shipment: staleCopy,
    vendorId: ownerId,
    orderReference: "local-order-id",
    lookupOrder: async () => ({ matchCount: 0, shipment: null }),
    now,
  });
  assert.equal(first.state, "found");
  assert.equal(second.state, "already_changed");
  assert.equal(reservation.status, "NEW");
  assert.equal(reservation.shiprocketShipmentId, "provider-shipment");
});

test("stale detection uses persisted reservation timestamps", () => {
  assert.equal(isStaleCreatingReservation(makeReservation(), now), true);
  assert.equal(isStaleCreatingReservation(makeReservation({ updatedAt: new Date(now) }), now), false);
});
