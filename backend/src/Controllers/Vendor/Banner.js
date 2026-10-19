import mongoose from "mongoose";
import Banner from "../../models/user/Banner.js";
import Product from "../../models/vendor/ProductModel.js";
import Cloudinary from "../../Config/Cloudinary.js";

const hasValidImageSignature = ({ mimetype, buffer }) => {
  if (!buffer) return false;
  if (mimetype === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimetype === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimetype === "image/webp") return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  return false;
};

export const getBanner = async (req, res) => {
  try {
    const vendorId = req.vendor?._id;
    if (!vendorId) return res.status(401).json({ message: "Please login as a vendor first" });
    const banner = await Banner.findOne({ vendorId });
    return res.status(200).json({ banner });
  } catch (error) {
    console.error("Get banner error:", error);
    return res.status(500).json({ message: "Failed to load banner" });
  }
};

export const saveBanner = async (req, res) => {
  try {
    const vendorId = req.vendor?._id;

    if (!vendorId) {
      return res.status(401).json({
        message: "Please login as a vendor first",
      });
    }

    const { title, highlighted, productId, buttonText = "Shop Now" } = req.body;

    if (!title?.trim() || !highlighted?.trim() || !productId || !buttonText?.trim())
      return res.status(400).json({ message: "Title, highlighted text, product and button text are required" });
    if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ message: "Invalid product selection" });
    if (req.file && !hasValidImageSignature(req.file))
      return res.status(400).json({ message: "Only PNG, JPG and WEBP images are allowed" });

    // Verify that the selected product belongs to this vendor.
    const product = await Product.findOne({
      _id: productId,
      vendorId,
      status: "active",
    });

    if (!product) {
      return res.status(400).json({
        message: "Selected product does not belong to this vendor",
      });
    }

    // Generate the URL using your actual frontend product route.
    const existing = await Banner.findOne({ vendorId }).select("image");
    if (!req.file && !existing?.image) return res.status(400).json({ message: "Banner image is required" });
    let image = existing?.image;
    if (req.file) {
      const result = await Cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "banners", resource_type: "image" },
      );
      image = result.secure_url;
    }
    const generatedProductUrl = `/product/${product._id}`;

    const banner = await Banner.findOneAndUpdate(
      { vendorId },
      {
        $set: {
          title: title.trim(),
          highlighted: highlighted.trim(),
          image,
          buttonText: buttonText.trim(),
          productId: product._id,
          productUrl: generatedProductUrl,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(existing ? 200 : 201).json({
      message: existing ? "Banner updated successfully" : "Banner saved successfully",
      banner,
    });
  } catch (error) {
    console.error("Save banner error:", error);

    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    if (error.name === "MulterError" && error.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Image must be 5 MB or smaller" });
    return res.status(500).json({ message: "Failed to save banner" });
  }
};
