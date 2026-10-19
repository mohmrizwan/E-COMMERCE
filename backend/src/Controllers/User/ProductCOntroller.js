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
        price:
          discount > 0
            ? Math.round(product.pricing * (1 - discount / 100))
            : product.pricing,
        oldPrice: discount > 0 ? product.pricing : null,
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

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: "active" })
      .populate("vendorId", "businessName").lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const discount = Number(product.discount) || 0;
    return res.status(200).json({ success: true, product: {
      ...product, discount,
      price: discount > 0 ? Math.round(product.pricing * (1 - discount / 100)) : product.pricing,
      oldPrice: discount > 0 ? product.pricing : null,
      store: product.vendorId?.businessName || "Store", inStock: product.stockQuantity > 0,
    } });
  } catch (error) {
    if (error.name === "CastError") return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(500).json({ success: false, message: "Failed to load product" });
  }
};
