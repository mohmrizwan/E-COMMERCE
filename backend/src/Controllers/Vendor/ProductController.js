import productModel from "../../models/vendor/ProductModel.js";
import Cloudinary from "../../Config/Cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const userId = req.vendor._id;

    const { name, description, category, pricing, stockQuantity, status } =
      req.body;

    if (
      !name ||
      !description ||
      !category ||
      !pricing ||
      !stockQuantity ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter all details of product",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Upload image to Cloudinary
    let result;

    result = await Cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "products",
      },
    );

    // Create product
    const newProduct = await productModel.create({
      vendorId: userId,
      name,
      description,
      category,
      pricing,
      stockQuantity,
      status,
      image: result.secure_url,
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.log("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const products = await productModel.find({ vendorId });

    return res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteproduct = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const productId = req.params.id;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendorId.toString() !== vendorId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await productModel.findByIdAndDelete(productId);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const productId = req.params.id;

    const { name, description, category, pricing, stockQuantity, status } =
      req.body;

    if (!vendorId) {
      return res.status(400).json({
        message: "Vendor not found",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.vendorId.toString() !== vendorId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    product.name = name;
    product.description = description;
    product.category = category;
    product.pricing = pricing;
    product.stockQuantity = stockQuantity;
    product.status = status;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const productId = req.params.id;

    if (!vendorId) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.vendorId.toString() !== vendorId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
