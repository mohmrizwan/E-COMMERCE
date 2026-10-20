export const SHIPROCKET_CREATING_STALE_AFTER_MS = 10 * 60 * 1000;

export class ShipmentAcceptanceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ShipmentAcceptanceError";
    this.status = status;
  }
}

export const getEligibleOrderItemsForShipment = (order, vendorId) => {
  const vendorIdString = String(vendorId || "");
  const vendorItems = (order?.items || []).filter(
    (item) => String(item.vendorId?._id || item.vendorId || "") === vendorIdString,
  );
  if (!vendorItems.length) {
    throw new ShipmentAcceptanceError("You are not authorized to accept this order", 403);
  }
  if (order.status === "Cancelled") {
    throw new ShipmentAcceptanceError("Order cannot be accepted");
  }
  if (order.paymentStatus !== "Paid") {
    throw new ShipmentAcceptanceError("Only paid orders can be shipped");
  }
  return vendorItems;
};

export const saveShipmentReservationForPaidOrder = async ({ order, vendorId, reservation }) => {
  getEligibleOrderItemsForShipment(order, vendorId);
  await reservation.save();
  return reservation;
};

/** Shiprocket's AWB response reports the assigned courier under response.data. */
export const validateShiprocketCourierAssignment = (payload) => {
  const data = payload?.response?.data || payload?.data || payload?.response || payload;
  const returnedId = String(data?.courier_company_id ?? "").trim();
  const awbCode = String(data?.awb_code ?? "").trim();

  if (payload?.awb_assign_status !== 1 || !awbCode || !/^\d+$/.test(returnedId)) {
    throw new Error("Shiprocket returned an incomplete courier/AWB assignment response");
  }

  return { ...data, courier_company_id: returnedId, awb_code: awbCode };
};

/** Shiprocket documents pickup_status=1 as the pickup success signal. */
export const validateShiprocketPickupResponse = (payload) => {
  if (payload?.pickup_status !== 1) return false;

  // Nested response details (including the scheduled date) are informational
  // and may be absent; an explicit provider error still invalidates success.
  const response = payload.response;
  const hasErrors = Array.isArray(response?.errors)
    ? response.errors.length > 0
    : Boolean(response?.errors);
  return !(
    response?.error ||
    hasErrors ||
    response?.status === false ||
    response?.status === "ERROR"
  );
};

export const isStaleCreatingReservation = (
  shipment,
  now = Date.now(),
  staleAfterMs = SHIPROCKET_CREATING_STALE_AFTER_MS,
) => {
  if (shipment?.status !== "CREATING") return false;
  const updatedAt = new Date(shipment.updatedAt || shipment.createdAt || 0).getTime();
  return Number.isFinite(updatedAt) && now - updatedAt >= staleAfterMs;
};

const reservationCompareAndSetFilter = (shipment, vendorId, staleBefore) => ({
  _id: shipment._id,
  vendorId,
  status: shipment.status,
  ...(shipment.status === "CREATING" ? { updatedAt: { $lte: staleBefore } } : {}),
});

/**
 * Reconcile only by looking up the exact local marketplace order reference.
 * A missing/ambiguous result remains CREATION_UNKNOWN; this helper never
 * submits a Shiprocket create-order request.
 */
export const reconcileShipmentReservation = async ({
  Shipment,
  shipment,
  vendorId,
  orderReference,
  lookupOrder,
  now = Date.now(),
  staleAfterMs = SHIPROCKET_CREATING_STALE_AFTER_MS,
}) => {
  const staleBefore = new Date(now - staleAfterMs);
  const isCreating = shipment?.status === "CREATING";
  if (isCreating && !isStaleCreatingReservation(shipment, now, staleAfterMs)) {
    return { state: "still_creating", shipment };
  }
  if (!isCreating && shipment?.status !== "CREATION_UNKNOWN") {
    return { state: "not_reconcilable", shipment };
  }

  let result;
  try {
    result = await lookupOrder(orderReference, vendorId);
  } catch {
    result = null;
  }

  const found = result?.matchCount === 1 &&
    result.shipment?.shipmentId &&
    result.shipment?.orderId;
  if (found) {
    const providerShipment = result.shipment;
    const updated = await Shipment.findOneAndUpdate(
      reservationCompareAndSetFilter(shipment, vendorId, staleBefore),
      {
        $set: {
          shiprocketOrderId: providerShipment.orderId,
          shiprocketShipmentId: providerShipment.shipmentId,
          awbCode: providerShipment.awbCode || "",
          ...(providerShipment.courierCompanyId
            ? { courierCompanyId: providerShipment.courierCompanyId }
            : {}),
          ...(providerShipment.courierName
            ? { courierName: providerShipment.courierName }
            : {}),
          status: providerShipment.awbCode ? "AWB_ASSIGNED" : "NEW",
        },
      },
      { new: true },
    );
    if (updated) return { state: "found", shipment: updated };
    return {
      state: "already_changed",
      shipment: await Shipment.findById(shipment._id),
    };
  }

  if (isCreating) {
    const unresolved = await Shipment.findOneAndUpdate(
      reservationCompareAndSetFilter(shipment, vendorId, staleBefore),
      { $set: { status: "CREATION_UNKNOWN" } },
      { new: true },
    );
    if (unresolved) {
      return {
        state: "unresolved",
        lookupFailed: result === null,
        shipment: unresolved,
      };
    }
    return {
      state: "already_changed",
      shipment: await Shipment.findById(shipment._id),
    };
  }

  return {
    state: "unresolved",
    lookupFailed: result === null,
    shipment,
  };
};
