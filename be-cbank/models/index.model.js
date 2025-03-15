const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  token: {
    type: String,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  balance: { type: Number, default: 0 },
  accountType: {
    type: String,
    enum: ["standard", "premium"],
    default: "standard",
  },
});

const User = mongoose.model("User", schema);

module.exports = User; // ✅ Ekspor model langsung
