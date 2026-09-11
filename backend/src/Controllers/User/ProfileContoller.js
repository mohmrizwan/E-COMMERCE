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

    const { name, phone, dateOfBirth } = req.body;

    // At least one field should be provided
    if (
      name === undefined &&
      phone === undefined &&
      dateOfBirth === undefined
    ) {
      return res.status(400).json({
        message: "Enter at least one detail to update",
      });
    }

    let userFind = await UserModel.findById(user);
    if (!userFind) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // Check only the fields that user wants to update
    if (name !== undefined && userFind.name === name) {
      return res.status(409).json({
        message: "Enter a new name",
      });
    }

    if (phone !== undefined && userFind.phone === phone) {
      return res.status(409).json({
        message: "Enter a new phone number",
      });
    }

    if (dateOfBirth !== undefined && userFind.dateOfBirth === dateOfBirth) {
      return res.status(409).json({
        message: "Enter a new date of birth",
      });
    }

    if (name !== undefined) userFind.name = name;
    if (phone !== undefined) userFind.phone = phone;
    if (dateOfBirth !== undefined) userFind.dateOfBirth = dateOfBirth;

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
