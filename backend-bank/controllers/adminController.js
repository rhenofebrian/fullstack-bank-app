import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import User from "../models/User.js";
import Transaction from "../models/transaction.js";
import { createError } from "../utils/error.js";

// Admin Login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(createError(401, "Invalid email or password"));
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid email or password"));
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get User by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Add Balance to User
export const addBalance = async (req, res, next) => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || !amount || amount <= 0) {
      return next(createError(400, "User ID and valid amount are required"));
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Create transaction
    const transaction = new Transaction({
      userId,
      adminId: req.admin.id,
      amount,
      type: "deposit",
      description: description || "Balance added by admin",
      status: "completed",
    });

    await transaction.save();

    // Update user balance if needed
    // This assumes you have a balance field in your User model
    // If not, you'll need to add it
    if (!user.balance) {
      user.balance = 0;
    }
    user.balance += amount;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Balance added successfully",
      transaction,
      newBalance: user.balance,
    });
  } catch (error) {
    next(error);
  }
};

// Get Transaction History
export const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const query = {};
    if (userId) {
      query.userId = userId;
    }

    const transactions = await Transaction.find(query)
      .populate("userId", "fullName email")
      .populate("adminId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Create Admin (for initial setup or super admin only)
export const createAdmin = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(createError(400, "Admin with this email already exists"));
    }

    // Create new admin
    const newAdmin = new Admin({
      fullName,
      email,
      password,
      role: role || "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(createError(400, "Email is already in use"));
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName || user.fullName,
        email: email || user.email,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Delete user's transactions
    await Transaction.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
