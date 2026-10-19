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

  const parcel = {
    weight: Math.round(weight * 10000) / 10000,
    length,
    breadth,
    height,
  };

  if (!Number.isFinite(parcel.weight) || parcel.weight <= 0) {
    throw new Error("Shipment weight must be a valid positive value in kilograms");
  }
  return parcel;
};

/** Shiprocket serviceability documents whole-centimeter dimensions. Round up
 * so the quote does not understate a fractional product measurement.
 */
export const formatServiceabilityParcel = (parcel) => {
  const weight = Number(parcel?.weight);
  const dimensions = ["length", "breadth", "height"];
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error("Shipment weight must be a valid positive value in kilograms");
  }

  const formatted = { weight };
  for (const field of dimensions) {
    const value = Number(parcel?.[field]);
    if (!Number.isFinite(value) || value <= 0.5) {
      throw new Error(`Shipment ${field} must be greater than 0.5 cm`);
    }
    formatted[field] = Math.ceil(value);
  }
  return formatted;
};

/** Value of one vendor's persisted merchandise only; prices are the server-
 * priced unit prices saved at checkout and exclude all shipping charges.
 */
export const calculateVendorMerchandiseValue = (order, vendorId) => {
  const vendorIdString = String(vendorId || "");
  const items = (order?.items || []).filter(
    (item) => String(item.vendorId?._id || item.vendorId) === vendorIdString,
  );
  if (!items.length) throw new Error("Vendor order has no merchandise items");

  let amountPaise = 0;
  for (const item of items) {
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    if (!Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
      throw new Error("Vendor order contains invalid merchandise pricing");
    }
    amountPaise += Math.round(price * 100) * quantity;
  }
  return amountPaise / 100;
};
