import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    settings: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Hash password sebelum disimpan
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("Password sebelum hashing:", this.password); // Debugging
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Password setelah hashing:", this.password); // Debugging

  next();
});

// Bandingkan password dengan hash yang tersimpan
userSchema.methods.comparePassword = async function (password) {
  console.log("Password input:", password); // Debugging
  console.log("Password hash di DB:", this.password); // Debugging

  return bcrypt.compare(password, this.password);
};

// Ekspor model
const User = mongoose.model("User", userSchema);
export default User;
