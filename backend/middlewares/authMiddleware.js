const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Support hardcoded admin token case
      if (decoded.id === "admin") {
        req.user = {
          _id: "admin",
          fullName: "Admin",
          email: "admin@careerhub.com",
          role: "admin",
          avatar: "",
        };
        return next();
      }

      // Find user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};

const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }
  next();
};

// ✅ NEW — Optional auth: if a valid token is present, attach req.user (so
// routes like GET /api/jobs can return isSaved/applicationStatus for logged-in
// job seekers), but never block the request if there's no token or it's invalid.
// This lets the same route stay public for anonymous browsing.
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.id === "admin") {
        req.user = {
          _id: "admin",
          fullName: "Admin",
          email: "admin@careerhub.com",
          role: "admin",
          avatar: "",
        };
      } else {
        req.user = await User.findById(decoded.id).select("-password");
      }
    }
  } catch (error) {
    // Invalid/expired token on a public route — just proceed as a guest.
    req.user = null;
  }
  next();
};

module.exports = { protect, admin, optionalAuth };