import UserModel from "../../models/user/AuthModel.js";
import orderModel from "../../models/user/MyOrdersModel.js";

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
