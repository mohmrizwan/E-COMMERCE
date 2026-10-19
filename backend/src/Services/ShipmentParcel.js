/** Build a conservative single-carton parcel from product package dimensions.
 * Units are kilograms and centimeters, as required by Shiprocket.
 */
export const calculateShipmentParcel = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Shipment has no products");
  }

  let weight = 0;
  let height = 0;
  let length = 0;
  let breadth = 0;

  for (const item of items) {
    const product = item.productId;
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Shipment contains an invalid product or quantity");
    }
    const missing = ["weight", "length", "breadth", "height"].filter(
      (field) => !Number.isFinite(Number(product[field])) || Number(product[field]) <= (field === "weight" ? 0 : 0.5),
    );
    if (missing.length) {
      throw new Error(
        `Shipping ${product.name || "product"} requires valid ${missing.join(", ")}. Ask the vendor to update its shipping details.`,
      );
    }

    weight += Number(product.weight) * quantity;
    length = Math.max(length, Number(product.length));
    breadth = Math.max(breadth, Number(product.breadth));
    // Assumption: units are packed stacked upright in one parcel. Merchants
    // should verify the final packed parcel before handoff to the courier.
    height += Number(product.height) * quantity;
  }

  return {
    weight: Math.round(weight * 10000) / 10000,
    length,
    breadth,
    height,
  };
};
