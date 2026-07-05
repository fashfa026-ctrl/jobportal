const express = require("express");

const {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// ✅ FIX: multer errors (bad file type, missing uploads/ dir, etc.) happen
// BEFORE the register controller runs, so they never reach its try/catch.
// Wrapping the middleware here ensures the client always gets a clean JSON
// error instead of an unhandled 500 with no message.
const handleAvatarUpload = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("❌ MULTER ERROR:", err.message);
      return res.status(400).json({ message: "File upload error: " + err.message });
    }
    next();
  });
};

router.post("/register", handleAvatarUpload, register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP); // ✅ NEW — Step 2: verify the OTP before allowing password reset
router.post("/reset-password", resetPassword); // ✅ CHANGED — no longer needs a :token URL param, takes email+otp+password in body

module.exports = exports = router;