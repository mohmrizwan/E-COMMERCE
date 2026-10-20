import VendorModel from "../models/vendor/AuthModel.js";
import mongoose from "mongoose";

export const isValidStoreOwnerId = (ownerId) =>
  typeof ownerId === "string" && /^[a-f\d]{24}$/i.test(ownerId);

export const matchesConfiguredStoreOwnerId = (candidateId, ownerId) =>
  isValidStoreOwnerId(ownerId) &&
  String(candidateId || "").toLowerCase() === ownerId.toLowerCase();

/** Resolve the only account authorized to own products in this deployment. */
export const findStoreOwner = (session) => {
  const ownerId = process.env.STORE_OWNER_ID;

  const query = VendorModel.findOne({
    // `_id: null` can never resolve a persisted vendor, while preserving the
    // Mongoose query interface expected by storefront callers when config is bad.
    _id: isValidStoreOwnerId(ownerId) ? new mongoose.Types.ObjectId(ownerId) : null,
    isVerified: true,
  }).select("businessName");

  return session ? query.session(session) : query;
};

export const storeOwnerProductFilter = (ownerId) => ({
  vendorId: ownerId,
  status: "active",
});
