import mongoose from "mongoose";

export const normalizeCartItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("No items found");
  }

  const quantitiesByProductId = new Map();
  for (const item of items) {
    const productId = String(item?.productId?._id || item?.productId || "");
    const quantity = Number(item?.quantity);
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      throw new TypeError("Invalid cart item");
    }

    const totalQuantity = (quantitiesByProductId.get(productId) || 0) + quantity;
    if (!Number.isSafeInteger(totalQuantity)) {
      throw new TypeError("Invalid item quantity");
    }
    quantitiesByProductId.set(productId, totalQuantity);
  }

  return Array.from(quantitiesByProductId, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

export const assertCartStockAvailable = (productName, quantity, stockQuantity) => {
  if (!Number.isFinite(stockQuantity) || stockQuantity < quantity) {
    throw new RangeError(
      `${productName || "A product"} does not have enough stock`,
    );
  }
};
