import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(createError(401, "Access denied. No token provided"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    next(error);
  }
};
