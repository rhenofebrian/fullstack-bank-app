import express from "express";
import {
  transferFunds,
  getTransferHistory,
} from "../controllers/transferController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Transfer funds
router.post("/", transferFunds);

// Get transfer history
router.get("/history", getTransferHistory);

export default router;
