const admin = require("firebase-admin");
const User = require("../models/index.model");
const { ERR } = require("./response");

// Inisialisasi Firebase Admin SDK
const serviceAccount = require("../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const checkToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Ambil token dari header

  if (!token) {
    return ERR(res, 401, "No token provided");
  }

  try {
    // Verifikasi token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      return ERR(res, 401, "Invalid token");
    }

    // Cari user di MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return ERR(res, 404, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    return ERR(res, 401, "Invalid or expired token");
  }
};

// Middleware untuk memeriksa role admin
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findbyId(req.user.id);
    if (!req.user || req.user.role !== "admin") {
      return ERR(res, 403, "Forbidden: Admins only");
    }
  } catch (error) {
    return ERR(res, 500, "authorization error");
  }
  next();
};

module.exports = { checkToken, checkAdmin };
