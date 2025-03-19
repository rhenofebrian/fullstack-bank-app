import express from "express";
import {
  adminLogin,
  getAllUsers,
  getUserById,
  addBalance,
  getTransactions,
  createAdmin,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import { authenticateAdmin, isSuperAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Special route for first admin setup (remove in production)
router.post("/setup-first-admin", createAdmin);

// Protected routes
router.get("/users", authenticateAdmin, getAllUsers);
router.get("/users/:id", authenticateAdmin, getUserById);
router.post("/users/add-balance", authenticateAdmin, addBalance);
router.put("/users/:id", authenticateAdmin, updateUser);
router.delete("/users/:id", authenticateAdmin, deleteUser);
router.get("/transactions", authenticateAdmin, getTransactions);

// Super admin routes
router.post("/create", authenticateAdmin, isSuperAdmin, createAdmin);

export default router;
