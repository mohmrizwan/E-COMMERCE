import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import VendorModel from "../src/models/vendor/AuthModel.js";
import ProductModel from "../src/models/vendor/ProductModel.js";
import Cloudinary from "../src/Config/Cloudinary.js";
import {
  LoginAccount,
  registerVendor,
  resendOtp,
  verifyOtp,
} from "../src/Controllers/Vendor/AuthControllers.js";
import { createProduct, updateProduct } from "../src/Controllers/Vendor/ProductController.js";
import { createVendorAuthMiddleware } from "../src/middlewares/VendorAuthMiddleware.js";
import { findStoreOwner } from "../src/Services/StoreOwner.js";

const ownerId = "507f1f77bcf86cd799439011";
const otherId = "507f1f77bcf86cd799439012";

const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

const setEnv = (values) => {
  const original = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  return () => {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
};

const useMockMailer = () => {
  const original = nodemailer.createTransport;
  nodemailer.createTransport = () => ({ sendMail: async () => ({ accepted: ["owner@example.test"] }) });
  return () => { nodemailer.createTransport = original; };
};

const useMock = (object, replacements) => {
  const originals = Object.fromEntries(Object.keys(replacements).map((key) => [key, object[key]]));
  Object.assign(object, replacements);
  return () => Object.assign(object, originals);
};

const vendorQuery = (vendor) => ({
  select() { return this; },
  session() { return this; },
  then(resolve, reject) { return Promise.resolve(vendor).then(resolve, reject); },
});

test("signup creates an unverified account with a six-digit expiring OTP and no owner flag", async () => {
  const restoreEnv = setEnv({ EMAIL_USER: "test@example.test", EMAIL_PASS: "test-only-password" });
  const restoreMailer = useMockMailer();
  let created;
  const restoreModel = useMock(VendorModel, {
    findOne: async () => null,
    create: async (fields) => { created = { _id: ownerId, ...fields }; return created; },
    findByIdAndDelete: async () => {},
  });
  const res = response();
  try {
    await registerVendor({ body: {
      businessName: "Test Store", ownerName: "Owner", email: "owner@example.test",
      phone: "9876543210", password: "safe-test-password", confirmPassword: "safe-test-password",
      role: "admin", isOwner: true, ownerSlot: "store-owner",
    } }, res);
    assert.equal(res.statusCode, 201);
    assert.equal(created.isVerified, false);
    assert.match(created.otp, /^\d{6}$/);
    assert.ok(created.otpExpiresAt > new Date());
    assert.equal(Object.hasOwn(created, "ownerSlot"), false);
    assert.equal(Object.hasOwn(created, "role"), false);
  } finally {
    restoreModel(); restoreMailer(); restoreEnv();
  }
});

test("OTP verification requires a matching unexpired code and never assigns ownership", async () => {
  const vendor = {
    _id: ownerId, otp: "123456", otpExpiresAt: new Date(Date.now() + 60_000),
    isVerified: false, async save() { this.saved = true; },
  };
  const restoreModel = useMock(VendorModel, { findById: async () => vendor });
  const res = response();
  try {
    await verifyOtp({ body: { vendorId: ownerId, otp: "000000" } }, res);
    assert.equal(res.statusCode, 409);
    assert.equal(vendor.isVerified, false);
    assert.equal(vendor.saved, undefined);

    res.statusCode = 200;
    await verifyOtp({ body: { vendorId: ownerId, otp: "123456" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(vendor.isVerified, true);
    assert.equal(vendor.otp, null);
    assert.equal(vendor.otpExpiresAt, null);
    assert.equal(Object.hasOwn(vendor, "ownerSlot"), false);
  } finally { restoreModel(); }
});

test("expired OTP cannot verify a vendor", async () => {
  const vendor = {
    otp: "123456", otpExpiresAt: new Date(Date.now() - 1000), isVerified: false,
    async save() { this.saved = true; },
  };
  const restoreModel = useMock(VendorModel, { findById: async () => vendor });
  const res = response();
  try {
    await verifyOtp({ body: { vendorId: ownerId, otp: "123456" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "OTP has expired");
    assert.equal(vendor.isVerified, false);
    assert.equal(vendor.saved, undefined);
  } finally { restoreModel(); }
});

test("resend keeps signup OTP delivery and expiry behavior", async () => {
  const restoreEnv = setEnv({ EMAIL_USER: "test@example.test", EMAIL_PASS: "test-only-password" });
  const restoreMailer = useMockMailer();
  const vendor = { _id: ownerId, email: "owner@example.test", isVerified: false, async save() { this.saved = true; } };
  const restoreModel = useMock(VendorModel, { findById: async () => vendor });
  const res = response();
  try {
    await resendOtp({ body: { vendorId: ownerId } }, res);
    assert.equal(res.statusCode, 200);
    assert.match(vendor.otp, /^\d{6}$/);
    assert.ok(vendor.otpExpiresAt > new Date());
  } finally { restoreModel(); restoreMailer(); restoreEnv(); }
});

test("login preserves verification/password checks and issues a JWT for the configured owner", async () => {
  const restoreEnv = setEnv({ STORE_OWNER_ID: ownerId, JWT_SECRET: "test-only-jwt-secret" });
  const passwordHash = await (await import("bcrypt")).default.hash("correct-test-password", 4);
  const restoreModel = useMock(VendorModel, {
    findOne: async () => ({ _id: ownerId, email: "owner@example.test", password: passwordHash, isVerified: true, tokenVersion: 3 }),
  });
  const res = response();
  try {
    await LoginAccount({ body: { email: "owner@example.test", password: "correct-test-password" } }, res);
    assert.equal(res.statusCode, 200);
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    assert.equal(decoded.userId, ownerId);
    assert.equal(decoded.tokenVersion, 3);
  } finally { restoreModel(); restoreEnv(); }
});

test("login denies missing, malformed, or mismatched STORE_OWNER_ID", async () => {
  const restoreEnv = setEnv({ JWT_SECRET: "test-only-jwt-secret" });
  const restoreModel = useMock(VendorModel, {
    findOne: async () => ({ _id: ownerId, email: "owner@example.test", isVerified: true, password: "unused" }),
  });
  const bcrypt = (await import("bcrypt")).default;
  const originalCompare = bcrypt.compare;
  bcrypt.compare = async () => true;
  try {
    for (const configuredId of [undefined, "invalid-id", otherId]) {
      if (configuredId === undefined) delete process.env.STORE_OWNER_ID;
      else process.env.STORE_OWNER_ID = configuredId;
      const res = response();
      await LoginAccount({ body: { email: "owner@example.test", password: "anything" } }, res);
      assert.equal(res.statusCode, 401);
    }
  } finally { bcrypt.compare = originalCompare; restoreModel(); restoreEnv(); }
});

test("login still rejects unverified accounts before issuing a token", async () => {
  const restoreEnv = setEnv({ STORE_OWNER_ID: ownerId });
  const restoreModel = useMock(VendorModel, {
    findOne: async () => ({ _id: ownerId, email: "owner@example.test", isVerified: false }),
  });
  const res = response();
  try {
    await LoginAccount({ body: { email: "owner@example.test", password: "unused" } }, res);
    assert.equal(res.statusCode, 403);
    assert.equal(res.body.message, "Please verify your email first");
  } finally { restoreModel(); restoreEnv(); }
});

test("vendor middleware requires the configured verified owner, valid JWT, and current tokenVersion", async () => {
  const restoreEnv = setEnv({ JWT_SECRET: "test-only-jwt-secret" });
  const vendor = { _id: ownerId, isVerified: true, tokenVersion: 2 };
  let lookupId;
  const middleware = createVendorAuthMiddleware({
    jwt,
    getStoreOwnerId: () => ownerId,
    VendorModel: { findById: (id) => { lookupId = id; return vendorQuery(vendor); } },
  });
  const token = jwt.sign({ userId: ownerId, tokenVersion: 2 }, process.env.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = response();
  let nextCalled = false;
  try {
    await middleware(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(lookupId, ownerId);
    assert.equal(req.vendor, vendor);
  } finally { restoreEnv(); }
});

test("vendor middleware fails closed for missing/invalid owner IDs, other vendors, and stale token versions", async () => {
  const restoreEnv = setEnv({ JWT_SECRET: "test-only-jwt-secret" });
  const vendor = { _id: ownerId, isVerified: true, tokenVersion: 2 };
  const middlewareFor = (configuredId) => createVendorAuthMiddleware({
    jwt,
    getStoreOwnerId: () => configuredId,
    VendorModel: { findById: () => vendorQuery(vendor) },
  });
  const tokenFor = (id, version = 2) => jwt.sign({ userId: id, tokenVersion: version }, process.env.JWT_SECRET);
  try {
    for (const [configuredId, token] of [
      [undefined, tokenFor(ownerId)], ["bad", tokenFor(ownerId)], [otherId, tokenFor(ownerId)],
      [ownerId, tokenFor(ownerId, 1)],
    ]) {
      const res = response();
      let nextCalled = false;
      await middlewareFor(configuredId)({ headers: { authorization: `Bearer ${token}` } }, res, () => { nextCalled = true; });
      assert.equal(res.statusCode, 401);
      assert.equal(nextCalled, false);
    }
  } finally { restoreEnv(); }
});

test("public owner resolution uses only a valid configured ID and verified account", async () => {
  const originalFindOne = VendorModel.findOne;
  const restoreEnv = setEnv({ STORE_OWNER_ID: "invalid" });
  let filter;
  VendorModel.findOne = (value) => {
    filter = value;
    const configuredVendor = String(value._id) === ownerId ? { _id: ownerId, isVerified: true } : null;
    return vendorQuery(configuredVendor);
  };
  try {
    assert.equal(await findStoreOwner(), null);
    assert.equal(filter._id, null);
    process.env.STORE_OWNER_ID = ownerId;
    const query = await findStoreOwner();
    assert.equal(String(filter._id), ownerId);
    assert.equal(filter.isVerified, true);
    assert.equal(query._id, ownerId);
  } finally { VendorModel.findOne = originalFindOne; restoreEnv(); }
});

test("public owner resolution returns no account when the configured ID is missing", async () => {
  const originalFindOne = VendorModel.findOne;
  const restoreEnv = setEnv({ STORE_OWNER_ID: "" });
  delete process.env.STORE_OWNER_ID;
  VendorModel.findOne = (filter) => vendorQuery(filter._id === null ? null : { _id: ownerId });
  try {
    assert.equal(await findStoreOwner(), null);
  } finally { VendorModel.findOne = originalFindOne; restoreEnv(); }
});

test("product creation ignores client vendorId and associates product with req.vendor._id", async () => {
  let created;
  const restoreProduct = useMock(ProductModel, {
    create: async (values) => { created = values; return values; },
  });
  const originalUpload = Cloudinary.uploader.upload;
  Cloudinary.uploader.upload = async () => ({ secure_url: "https://example.test/image.png" });
  const res = response();
  try {
    await createProduct({
      vendor: { _id: ownerId }, files: [{ mimetype: "image/png", buffer: Buffer.from("test") }],
      body: {
        vendorId: otherId, name: "Cup", description: "A cup", category: "Kitchen",
        pricing: "12", discount: "0", stockQuantity: "4", status: "active", brand: "Acme",
        weight: "1", length: "1", breadth: "1", height: "1",
      },
    }, res);
    assert.equal(res.statusCode, 201);
    assert.equal(created.vendorId, ownerId);
  } finally { restoreProduct(); Cloudinary.uploader.upload = originalUpload; }
});

test("product update rejects another vendor's product", async () => {
  let saved = false;
  const product = { vendorId: otherId, async save() { saved = true; } };
  const restoreProduct = useMock(ProductModel, { findById: async () => product });
  const res = response();
  try {
    await updateProduct({ vendor: { _id: ownerId }, params: { id: "product-id" }, body: {} }, res);
    assert.equal(res.statusCode, 403);
    assert.equal(saved, false);
  } finally { restoreProduct(); }
});

test("vendor schema no longer declares ownerSlot while retaining account uniqueness indexes", () => {
  assert.equal(VendorModel.schema.path("ownerSlot"), undefined);
  const indexes = VendorModel.schema.indexes();
  assert.ok(indexes.some(([keys]) => keys.storefrontDomains === 1));
  assert.ok(indexes.some(([keys]) => keys.email === 1));
  assert.ok(indexes.some(([keys]) => keys.phone === 1));
});
