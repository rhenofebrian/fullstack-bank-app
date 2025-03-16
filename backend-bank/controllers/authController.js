import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

// **Register User**
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User dengan email ini sudah ada"));
    }

    // Buat user baru (password otomatis di-hash dalam model)
    const newUser = new User({ fullName, email, password });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// **Login User**
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("🟢 Mencari user dengan email:", email); // Debugging
    const user = await User.findOne({ email });

    if (!user) {
      console.log("🔴 User tidak ditemukan");
      return next(createError(401, "Invalid email or password"));
    }

    console.log("🟡 Password input:", password);
    console.log("🟡 Password hash di DB:", user.password);

    const isPasswordValid = await user.comparePassword(password);
    console.log("🟢 Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return next(createError(401, "Invalid email or password"));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("🟢 Token JWT dibuat:", token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("❌ Error saat login:", error);
    next(error);
  }
};

// **Get Current User**
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// **Update Profile**
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, address, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// **Change Password**
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(createError(401, "Current password is incorrect"));
    }

    // Hash password baru sebelum disimpan
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// **Update Settings**
export const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    user.settings = settings;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};
