import Product from "../../models/vendor/ProductModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .populate("vendorId", "businessName")
      .lean();

    const listingProducts = products.map((product) => {
      const discount = Number(product.discount) || 0;

      return {
        ...product,
        discount,
        price: product.pricing,
        oldPrice:
          discount > 0
            ? Math.round(product.pricing / (1 - discount / 100))
            : null,
        store: product.vendorId?.businessName || "Store",
        inStock: product.stockQuantity > 0,
      };
    });

    res.status(200).json({
      success: true,
      products: listingProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server errors",
    });
  }
};
