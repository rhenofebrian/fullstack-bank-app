const User = require("../models/index.model");
const { ERR, OK } = require("../utils/response");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

// user section
const transferUser = async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Cek apakah user premium (tanpa biaya admin)
    const isPremium = sender.accountType === "premium";
    const adminFee = isPremium ? 0 : 500;

    if (sender.balance < amount + adminFee) {
      return res
        .status(400)
        .json({ message: "Insufficient balance including admin fee" });
    }

    // Proses transfer
    sender.balance -= amount + adminFee;
    receiver.balance += amount;

    // Simpan transaksi ke database
    sender.transactions.push({
      type: "user_transfer",
      amount,
      from: sender.email,
      to: receiver.email,
    });

    receiver.transactions.push({
      type: "user_transfer",
      amount,
      from: sender.email,
      to: receiver.email,
    });

    await sender.save();
    await receiver.save();

    res.status(200).json({
      message: "Balance sent successfully",
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
      adminFee: isPremium
        ? "No fee (Premium User)"
        : `Rp${adminFee} (Standard User)`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to send balance" });
  }
};

// admin section
const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching users from database...");
    const users = await User.find().select("-password");
    console.log("Users found:", users);

    if (!users.length) {
      return ERR(res, 404, "No users found"); // Jika database kosong
    }

    return OK(res, 200, users, "Users retrieved successfully");
  } catch (err) {
    console.error("Error retrieving users:", err);
    return ERR(res, 500, "Failed to retrieve users");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return ERR(res, 400, "Invalid ID format");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return ERR(res, 404, "User not found");
    }

    return OK(res, 200, null, "User deleted successfully");
  } catch (err) {
    return ERR(res, 500, "Failed to delete user");
  }
};

const sendBalance = async (req, res) => {
  try {
    const { userEmail, amount } = req.body;

    console.log("📩 Received Request:", req.body); // Log request

    if (!userEmail || amount <= 0) {
      console.log("⚠️ Invalid data:", { userEmail, amount });
      return res.status(400).json({ isError: true, message: "Invalid data" });
    }

    const receiver = await User.findOne({ email: userEmail });

    if (!receiver) {
      console.log("❌ Receiver not found:", userEmail);
      return res
        .status(404)
        .json({ isError: true, message: "Receiver not found" });
    }

    console.log("✅ Receiver found:", receiver.email);

    receiver.balance += amount;

    console.log("💰 New Balance:", receiver.balance);

    await receiver.save();

    return OK(res, 200, receiver.balance, "balance sent successfully");
  } catch (err) {
    console.error("❌ Error sending balance:", err);
    return res
      .status(500)
      .json({ isError: true, message: "Failed to send balance" });
  }
};

// premium account
const upgradeToPremium = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return ERR(res, 404, "user not found");

    if (user.accountType === "premium") {
      return ERR(res, 404, "user already has a premium account");
    }

    user.accountType = "premium";
    await user.save();
    return OK(res, 200, "account upgraded to premium account");
  } catch (error) {
    return ERR(res, 500, "Welcome, Premium User!");
  }
};

// auth section
const signInToken = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email });

    if (!user) return ERR(res, 400, "user not found");

    const isPasswordOK = await argon2.verify(user.password, password);
    if (!isPasswordOK) return ERR(res, 400, "incorrect password");

    user.token = token;

    await user.save();

    console.log("📩 Request body:", req.body);
    console.log("🔍 Email yang diterima:", req.body.email);
    console.log("🔍 Token yang diterima:", req.body.token);

    return OK(res, 200, null, "sign in token saved");
  } catch (error) {
    return ERR(res, 500, "error sign in token");
  }
};

const signOutToken = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.token = null;

  await user.save();
  return OK(res, 204, null, "successful signed out");
};

const signUpUser = async (req, res) => {
  const { email, password } = req.body;
  const hashPass = await argon2.hash(password);

  try {
    const user = await User.findOne({ email });
    if (user) return ERR(res, 400, "email already registered");

    const addNewUser = new User({ email, password: hashPass });
    await addNewUser.save();
    return OK(res, 201, addNewUser._id, "Sign Up Success");
  } catch (err) {
    console.log(err);
    return ERR(res, 500, "sign up failed");
  }
};

module.exports = {
  signInToken,
  signOutToken,
  signUpUser,
  getAllUsers,
  deleteUser,
  sendBalance,
  upgradeToPremium,
  transferUser,
};
