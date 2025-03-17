import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import Admin from "../models/admin.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header or cookies
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return next(createError(401, "Access denied. No token provided"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token
    if (!decoded.role || !["admin", "super_admin"].includes(decoded.role)) {
      return next(createError(403, "Access denied. Not an admin"));
    }

    // Find admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return next(createError(404, "Admin not found"));
    }

    // Attach admin to request
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    return next(error);
  }
};

// Middleware to check if admin is super admin
export const isSuperAdmin = (req, res, next) => {
  if (req.admin?.role === "super_admin") {
    return next();
  }
  return next(createError(403, "Access denied. Super admin required"));
};
