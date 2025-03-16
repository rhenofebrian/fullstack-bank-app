import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  updateSettings,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Dapatkan User Saat Ini (Harus login)
router.get("/me", authenticate, getCurrentUser);

// Update Profile
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.put("/settings", authenticate, updateSettings);

export default router;
