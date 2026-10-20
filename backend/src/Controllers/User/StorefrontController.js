import Product from "../../models/vendor/ProductModel.js";
import Banner from "../../models/user/Banner.js";
import { findStoreOwner, storeOwnerProductFilter } from "../../Services/StoreOwner.js";

const resolveStorefront = () => findStoreOwner().lean();

export const getStorefront = async (req, res) => {
  try {
    const vendor = await resolveStorefront();
    if (!vendor) {
      return res.status(503).json({ success: false, message: "Store owner is not configured" });
    }

    return res.status(200).json({
      success: true,
      storefront: { vendorId: vendor._id, businessName: vendor.businessName },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Could not load storefront" });
  }
};

export const getStorefrontProducts = async (req, res) => {
  try {
    const vendor = await resolveStorefront();
    if (!vendor) {
      return res.status(503).json({ success: false, message: "Store owner is not configured" });
    }

    const products = await Product.find(storeOwnerProductFilter(vendor._id))
      .populate("vendorId", "businessName")
      .lean();
    return res.status(200).json({
      success: true,
      products: products.map((product) => {
        const discount = Number(product.discount) || 0;
        return {
          ...product,
          discount,
          price: discount > 0
            ? Math.round(product.pricing * (1 - discount / 100))
            : product.pricing,
          oldPrice: discount > 0 ? product.pricing : null,
          store: vendor.businessName,
          inStock: product.stockQuantity > 0,
        };
      }),
    });
  } catch {
    return res.status(500).json({ success: false, message: "Could not load storefront products" });
  }
};

export const getStorefrontBanners = async (req, res) => {
  try {
    const vendor = await resolveStorefront();
    if (!vendor) {
      return res.status(503).json({ success: false, message: "Store owner is not configured" });
    }
    const banners = await Banner.find({ vendorId: vendor._id })
      .populate({
        path: "productId",
        match: storeOwnerProductFilter(vendor._id),
        select: "name status image pricing discount stockQuantity",
      })
      .populate("vendorId", "businessName")
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      banners: banners
        .filter((banner) => banner.productId)
        .map((banner) => {
          const product = banner.productId;
          const discount = Number(product.discount) || 0;
          const vendorName = banner.vendorId?.businessName || "Vendor";
          return {
            ...banner,
            vendorName,
            productUrl: `/product/${product._id}`,
            cartProduct: {
              _id: product._id,
              name: product.name,
              image: product.image,
              pricing: product.pricing,
              discount,
              price: discount > 0
                ? Math.round(product.pricing * (1 - discount / 100))
                : product.pricing,
              oldPrice: discount > 0 ? product.pricing : null,
              stockQuantity: product.stockQuantity,
              status: product.status,
              vendorName,
              inStock: product.stockQuantity > 0,
            },
          };
        }),
    });
  } catch (error) {
    console.error("Get storefront banners error:", error);
    return res.status(500).json({ success: false, message: "Could not load storefront banners" });
  }
};
