import brand from "../../models/vendor/BrandModel.js";
import category from "../../models/vendor/CategoryModel.js";
import mongoose from "mongoose";

// Add Brand
export const addBrand = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ message: "Vendor id required for this task" });
    }
    const { name, logo } = req.body;

    if (!name || !logo) {
      return res.status(400).json("name and logo required");
    }
    const brandCreate = await brand.create({
      name,
      logo,
      type: "Brand",
    });

    res.status(201).json({
      success: true,
      message: "Brand added successfully",
      brandCreate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

// Get All Brands
export const getBrands = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ message: "Vendor id required for this task" });
    }
    const brands = await brand.find({});
    console.log(brands, " = brands");
    res.status(200).json({
      success: true,
      brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

// Update Brand
export const updateBrand = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ message: "Vendor id required for this task" });
    }
    const { id } = req.params;
    const { name, logo } = req.body;

    const brandUpdate = await brand.findOneAndUpdate(
      { _id: id, type: "Brand" },
      { name, logo },
      { new: true, runValidators: true },
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brandUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Brand
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ message: "Vendor id required for this task" });
    }
    const brandDel = await brand.findByIdAndDelete(id);

    if (!brandDel) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Category
export const addCategory = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ success: false, message: "Vendor id required for this task" });
    }

    const { name, status } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "name required",
      });
    }

    const categoryCreate = await category.create({
      name: String(name).trim(),
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      categoryCreate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ success: false, message: "Vendor id required for this task" });
    }

    const categories = await category.find({});
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ success: false, message: "Vendor id required for this task" });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const { name, status } = req.body;
    const update = {};

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "name required",
        });
      }
      update.name = String(name).trim();
    }

    if (status !== undefined) {
      update.status = status;
    }

    const categoryUpdate = await category.findOneAndUpdate(
      { _id: id },
      update,
      { new: true, runValidators: true },
    );

    if (!categoryUpdate) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      categoryUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    if (!vendorId) {
      return res
        .status(500)
        .json({ success: false, message: "Vendor id required for this task" });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const categoryDel = await category.findByIdAndDelete(id);

    if (!categoryDel) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};
