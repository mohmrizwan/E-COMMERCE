import UserModel from "../../models/user/AuthModel.js";
import orderModel from "../../models/user/MyOrdersModel.js";
import AddressModel from "../../models/user/AddressModel.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userFind = await UserModel.findById(userId).select(
      "-password -otp -otpExpiresAt",
    );

    if (!userFind) {
      return res.status(400).json({ message: "User Not Found" });
    }

    res.status(200).json(userFind);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = req.user.id;

    const { name, phone, dateOfBirth, gender } = req.body;

    // At least one field should be provided
    if (
      name === undefined &&
      phone === undefined &&
      dateOfBirth === undefined &&
      gender === undefined
    ) {
      return res.status(400).json({
        message: "Enter at least one detail to update",
      });
    }

    let userFind = await UserModel.findById(user);
    if (!userFind) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const updates = {};
    if (name !== undefined && name !== userFind.name) updates.name = name;
    if (
      phone !== undefined &&
      String(phone ?? "") !== String(userFind.phone ?? "")
    ) {
      updates.phone = phone;
    }
    if (dateOfBirth !== undefined && dateOfBirth !== userFind.dateOfBirth) {
      updates.dateOfBirth = dateOfBirth;
    }
    if (gender !== undefined && gender !== userFind.gender) {
      updates.gender = gender;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(409).json({
        message: "No profile changes detected",
      });
    }

    Object.assign(userFind, updates);

    await userFind.save();

    const updatedUser = await UserModel.findById(user).select(
      "-password -otp -otpExpiresAt",
    );
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await AddressModel.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const getOrder = await orderModel
      .find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    if (!getOrder.length) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Orders fetched successfully",
      getOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, name, phone, state, city, pincode, address } = req.body;

    if (!type || !name || !phone || !state || !city || !pincode || !address) {
      return res.status(400).json({
        message: "Enter all address details",
      });
    }

    const newAddress = await AddressModel.create({
      userId,
      type,
      name,
      phone,
      state,
      city,
      pincode,
      address,
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { type, name, phone, state, city, pincode, address } = req.body;

    const addressFind = await AddressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!addressFind) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (type !== undefined) addressFind.type = type;
    if (name !== undefined) addressFind.name = name;
    if (phone !== undefined) addressFind.phone = phone;
    if (state !== undefined) addressFind.state = state;
    if (city !== undefined) addressFind.city = city;
    if (pincode !== undefined) addressFind.pincode = pincode;
    if (address !== undefined) addressFind.address = address;

    await addressFind.save();

    res.status(200).json({
      message: "Address updated successfully",
      address: addressFind,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const addressFind = await AddressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!addressFind) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
