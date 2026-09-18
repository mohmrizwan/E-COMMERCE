import productModel from "../../models/vendor/ProductModel.js";
import cloudinary from "../../Config/Cloudinary.js";

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

    result = await cloudinary.uploader.upload(
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
      return res.status(404).json({ message: "vendor not found" });
    }
    const products = await productModel.find({ vendorId });

    if (products.length === 0) {
      return res.status(404).json("Error to find the products");
    }

    return res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
