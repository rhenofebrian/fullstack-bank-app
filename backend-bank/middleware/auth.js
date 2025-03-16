import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const authenticate = (req, res, next) => {
  // Coba ambil token dari Header Authorization
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token; // Jika menggunakan cookies
  }

  if (!token) {
    return next(createError(401, "Access denied. No token provided"));
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(createError(401, "Invalid token"));
  }
};
