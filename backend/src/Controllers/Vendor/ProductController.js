import productModel from "../../models/vendor/ProductModel.js";
import Cloudinary from "../../Config/Cloudinary.js";

const parseShippingDetails = (values) => {
  const fields = ["weight", "length", "breadth", "height"];
  const parsed = {};
  for (const field of fields) {
    const value = values[field];
    if (value === undefined || value === "") {
      return { error: `Enter a valid positive ${field} for shipping` };
    }
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
      return {
        error: `${field[0].toUpperCase()}${field.slice(1)} must be greater than zero`,
      };
    }
    if (field !== "weight" && number <= 0.5) {
      return {
        error: `${field[0].toUpperCase()}${field.slice(1)} must be greater than 0.5 cm for Shiprocket`,
      };
    }
    parsed[field] = number;
  }
  return { values: parsed };
};

export const createProduct = async (req, res) => {
  try {
    const userId = req.vendor._id;

    const {
      name,
      description,
      category,
      pricing,
      discount = 0,
      stockQuantity,
      brand,
      status,
      weight,
      length,
      breadth,
      height,
      isDangerous,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      pricing === undefined ||
      pricing === "" ||
      !brand ||
      stockQuantity === undefined ||
      stockQuantity === "" ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter all details of product",
      });
    }

    const shippingDetails = parseShippingDetails({
      weight,
      length,
      breadth,
      height,
    });
    if (shippingDetails.error)
      return res
        .status(400)
        .json({ success: false, message: shippingDetails.error });

    const discountValue = Number(discount);
    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      discountValue > 99
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 99 percent",
      });
    }

    if (!req.files || !req.files.length) {
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

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        Cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" },
        ),
      ),
    );
    const imageUrls = uploadedImages.map((result) => result.secure_url);

    // Create product
    const newProduct = await productModel.create({
      vendorId: userId,
      name,
      description,
      category,
      pricing,
      brand,
      discount: discountValue,
      stockQuantity,
      ...shippingDetails.values,
      isDangerous: isDangerous === true || isDangerous === "true",
      status,
      image: imageUrls[0],
      images: imageUrls,
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product: newProduct,
    });
  } catch (error) {

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

    const {
      name,
      description,
      category,
      pricing,
      discount,
      stockQuantity,
      status,
      weight,
      length,
      brand,
      breadth,
      height,
      isDangerous,
    } = req.body;

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

    if (req.files && req.files.length) {
      const uploadedImages = await Promise.all(
        req.files.map((file) =>
          Cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "products" },
          ),
        ),
      );
      const imageUrls = uploadedImages.map((result) => result.secure_url);
      product.images = [...(product.images || []), ...imageUrls];
      if (!product.image) {
        product.image = imageUrls[0];
      }
    }

    if (discount !== undefined) {
      const discountValue = Number(discount);
      if (
        !Number.isFinite(discountValue) ||
        discountValue < 0 ||
        discountValue > 99
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount must be between 0 and 99 percent",
        });
      }
      product.discount = discountValue;
    }

    const shippingDetails = parseShippingDetails({
      weight,
      length,
      breadth,
      height,
    });
    if (shippingDetails.error)
      return res
        .status(400)
        .json({ success: false, message: shippingDetails.error });

    product.name = name;
    product.description = description;
    product.category = category;
    product.pricing = pricing;
    product.stockQuantity = stockQuantity;
    product.status = status;
    if (brand !== undefined) {
      product.brand = brand;
    }
    Object.assign(product, shippingDetails.values);
    if (isDangerous !== undefined) {
      product.isDangerous = isDangerous === true || isDangerous === "true";
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {

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

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
