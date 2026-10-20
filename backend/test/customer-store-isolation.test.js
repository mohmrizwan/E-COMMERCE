import test from "node:test";
import assert from "node:assert/strict";
import VendorModel from "../src/models/vendor/AuthModel.js";
import ProductModel from "../src/models/vendor/ProductModel.js";
import FavoritesModel from "../src/models/user/FavioritesModel.js";
import { addToFavorite, getFavorites } from "../src/Controllers/User/FavoritesController.js";
import { getAllProducts, getProductById } from "../src/Controllers/User/ProductCOntroller.js";
import {
  getStorefrontBanners,
  getStorefrontProducts,
} from "../src/Controllers/User/StorefrontController.js";

const ownerId = "507f1f77bcf86cd799439011";
const otherVendorId = "507f1f77bcf86cd799439012";

const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

const useMock = (object, replacements) => {
  const originals = Object.fromEntries(
    Object.keys(replacements).map((key) => [key, object[key]]),
  );
  Object.assign(object, replacements);
  return () => Object.assign(object, originals);
};

const ownerQuery = {
  select() { return this; },
  then(resolve, reject) {
    return Promise.resolve({ _id: ownerId, businessName: "Store" }).then(resolve, reject);
  },
};

const setOwnerConfig = () => {
  const previous = process.env.STORE_OWNER_ID;
  process.env.STORE_OWNER_ID = ownerId;
  return () => {
    if (previous === undefined) delete process.env.STORE_OWNER_ID;
    else process.env.STORE_OWNER_ID = previous;
  };
};

test("favorite writes only accept active products owned by STORE_OWNER_ID", async () => {
  const restoreEnv = setOwnerConfig();
  let productFilter;
  let favoriteCreated;
  const restoreVendor = useMock(VendorModel, { findOne: () => ownerQuery });
  const restoreProduct = useMock(ProductModel, {
    findOne: async (filter) => {
      productFilter = filter;
      return filter._id === "owner-product" ? { _id: filter._id } : null;
    },
  });
  const restoreFavorites = useMock(FavoritesModel, {
    findOne: async () => null,
    create: async (document) => { favoriteCreated = document; return document; },
  });

  try {
    const foreignResponse = response();
    await addToFavorite({
      user: { id: "customer-id" },
      params: { productId: "foreign-product" },
      body: { vendorId: otherVendorId },
    }, foreignResponse);

    assert.equal(foreignResponse.statusCode, 404);
    assert.deepEqual(productFilter, {
      _id: "foreign-product",
      vendorId: ownerId,
      status: "active",
    });
    assert.equal(favoriteCreated, undefined);

    const ownerResponse = response();
    await addToFavorite({
      user: { id: "customer-id" },
      params: { productId: "owner-product" },
      body: { vendorId: otherVendorId },
    }, ownerResponse);

    assert.equal(ownerResponse.statusCode, 201);
    assert.deepEqual(favoriteCreated, {
      userId: "customer-id",
      favorites: ["owner-product"],
    });
    assert.equal(productFilter.vendorId, ownerId);
  } finally {
    restoreFavorites();
    restoreProduct();
    restoreVendor();
    restoreEnv();
  }
});

test("favorite reads exclude legacy products outside the configured store", async () => {
  const restoreEnv = setOwnerConfig();
  let populateOptions;
  const restoreVendor = useMock(VendorModel, { findOne: () => ownerQuery });
  const restoreFavorites = useMock(FavoritesModel, {
    findOne: () => ({
      populate(options) {
        populateOptions = options;
        return Promise.resolve({ favorites: [{ _id: "owner-product" }, null] });
      },
    }),
  });

  try {
    const res = response();
    await getFavorites({ user: { id: "customer-id" } }, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(populateOptions, {
      path: "favorites",
      match: { vendorId: ownerId, status: "active" },
    });
    assert.deepEqual(res.body.favorites, [{ _id: "owner-product" }]);
  } finally {
    restoreFavorites();
    restoreVendor();
    restoreEnv();
  }
});

test("public product listing and details query only active products of STORE_OWNER_ID", async () => {
  const restoreEnv = setOwnerConfig();
  const restoreVendor = useMock(VendorModel, { findOne: () => ownerQuery });
  const filters = [];
  const query = (value) => ({
    populate() { return this; },
    lean() { return Promise.resolve(value); },
  });
  const restoreProduct = useMock(ProductModel, {
    find: (filter) => { filters.push(filter); return query([]); },
    findOne: (filter) => { filters.push(filter); return query(null); },
  });

  try {
    const listingResponse = response();
    await getAllProducts({}, listingResponse);
    const detailResponse = response();
    await getProductById({ params: { id: "product-id" } }, detailResponse);

    assert.deepEqual(filters, [
      { vendorId: ownerId, status: "active" },
      { _id: "product-id", vendorId: ownerId, status: "active" },
    ]);
    assert.equal(listingResponse.statusCode, 200);
    assert.equal(detailResponse.statusCode, 404);
  } finally {
    restoreProduct();
    restoreVendor();
    restoreEnv();
  }
});

test("public storefront products and banners are scoped to the configured owner", async () => {
  const restoreEnv = setOwnerConfig();
  const restoreVendor = useMock(VendorModel, {
    findOne: () => ({
      ...ownerQuery,
      lean() { return Promise.resolve({ _id: ownerId, businessName: "Store" }); },
    }),
  });
  const productFilters = [];
  const productQuery = {
    populate() { return this; },
    lean() { return Promise.resolve([]); },
  };
  const restoreProduct = useMock(ProductModel, {
    find: (filter) => { productFilters.push(filter); return productQuery; },
  });
  let bannerFilter;
  const bannerPopulateOptions = [];
  const bannerQuery = {
    populate(options) { bannerPopulateOptions.push(options); return this; },
    sort() { return this; },
    lean() { return Promise.resolve([]); },
  };
  const restoreBanner = useMock((await import("../src/models/user/Banner.js")).default, {
    find: (filter) => { bannerFilter = filter; return bannerQuery; },
  });

  try {
    const productsResponse = response();
    await getStorefrontProducts({}, productsResponse);
    const bannersResponse = response();
    await getStorefrontBanners({}, bannersResponse);

    assert.deepEqual(productFilters, [{ vendorId: ownerId, status: "active" }]);
    assert.deepEqual(bannerFilter, { vendorId: ownerId });
    assert.deepEqual(bannerPopulateOptions[0], {
      path: "productId",
      match: { vendorId: ownerId, status: "active" },
      select: "name status image pricing discount stockQuantity",
    });
    assert.equal(productsResponse.statusCode, 200);
    assert.equal(bannersResponse.statusCode, 200);
  } finally {
    restoreBanner();
    restoreProduct();
    restoreVendor();
    restoreEnv();
  }
});
