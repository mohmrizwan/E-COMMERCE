export class RouteTransferConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "RouteTransferConfigurationError";
    this.status = 503;
  }
}

/** Calculate each Route recipient from server-priced items and server quotes. */
export const buildRouteTransferAllocations = ({
  vendorSubtotalsPaise,
  vendorShippingQuotes,
  vendorConfigs,
  orderAmountPaise,
}) => {
  const shippingByVendor = new Map(
    vendorShippingQuotes.map((quote) => [
      String(quote.vendorId),
      Math.round(Number(quote.shippingAmount) * 100),
    ]),
  );
  const allocations = [];

  for (const [vendorId, subtotalPaise] of vendorSubtotalsPaise) {
    const config = vendorConfigs.get(String(vendorId));
    const linkedAccountId = String(config?.linkedAccountId || "");
    if (!config?.enabled || !/^acc_[A-Za-z0-9]+$/.test(linkedAccountId)) {
      throw new RouteTransferConfigurationError(
        "Every vendor in the cart must have an approved Razorpay Route linked account",
      );
    }

    const amountPaise = subtotalPaise + (shippingByVendor.get(String(vendorId)) || 0);
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
      throw new RouteTransferConfigurationError("Vendor transfer amount is invalid");
    }
    allocations.push({ vendorId, linkedAccountId, amountPaise });
  }

  const allocatedTotal = allocations.reduce((sum, allocation) => sum + allocation.amountPaise, 0);
  if (
    allocations.length === 0 ||
    !Number.isSafeInteger(orderAmountPaise) ||
    allocatedTotal !== orderAmountPaise
  ) {
    throw new RouteTransferConfigurationError(
      "Vendor transfer allocations do not match the server-calculated order total",
    );
  }

  return allocations;
};
