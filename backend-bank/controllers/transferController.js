import User from "../models/User.js";
import Transaction from "../models/transaction.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";

// Transfer funds between users
export const transferFunds = async (req, res, next) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recipientEmail, amount, description } = req.body;

    // Make sure we have the user ID
    if (!req.user || !req.user.id) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(401, "User authentication failed"));
    }

    const senderId = req.user.id;

    // Log for debugging
    console.log("Transfer request:", {
      senderId,
      recipientEmail,
      amount,
      description,
    });

    // Validate input
    if (!recipientEmail || !amount || amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(400, "Valid recipient email and amount are required")
      );
    }

    // Check if sender and recipient are different
    if (req.user.email === recipientEmail) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "You cannot transfer funds to yourself"));
    }

    // Find sender with session
    const sender = await User.findById(senderId).session(session);
    if (!sender) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Sender not found"));
    }

    // Check if sender has enough balance
    if (sender.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "Insufficient balance"));
    }

    // Find recipient with session
    const recipient = await User.findOne({ email: recipientEmail }).session(
      session
    );
    if (!recipient) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Recipient not found"));
    }

    // Create transaction for sender (withdrawal)
    const senderTransaction = new Transaction({
      userId: senderId,
      amount,
      type: "withdrawal",
      description: description || `Transfer to ${recipientEmail}`,
      status: "completed",
      relatedUserId: recipient._id,
    });

    // Create transaction for recipient (deposit)
    const recipientTransaction = new Transaction({
      userId: recipient._id,
      amount,
      type: "deposit",
      description: description || `Transfer from ${sender.email}`,
      status: "completed",
      relatedUserId: senderId,
    });

    // Update balances
    sender.balance -= amount;
    recipient.balance += amount;

    // Save all changes in a transaction
    await senderTransaction.save({ session });
    await recipientTransaction.save({ session });
    await sender.save({ session });
    await recipient.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Transfer completed successfully",
      transaction: senderTransaction,
      newBalance: sender.balance,
    });
  } catch (error) {
    // Abort the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Transfer error:", error);
    next(error);
  }
};

// Get transfer history for the current user
export const getTransferHistory = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(createError(401, "User authentication failed"));
    }

    const userId = req.user.id;

    const transactions = await Transaction.find({
      userId,
      $or: [{ type: "deposit" }, { type: "withdrawal" }],
    })
      .sort({ createdAt: -1 })
      .populate("relatedUserId", "fullName email");

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get transfer history error:", error);
    next(error);
  }
};
