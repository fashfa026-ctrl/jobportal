const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  deleteResume,
  getPublicProfile,
  getMyProfile, // ✅ சேர்த்தேன்
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// ✅ /profile GET - முதல்ல வைக்கணும் (/:id-க்கு முன்னாடி)
router.get("/profile", protect, getMyProfile);
router.get("/", protect, getAllUsers);
router.get("/single/:id", protect, getUserById);
const handleProfileUploads = (req, res, next) => {
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.error("❌ PROFILE UPLOAD ERROR:", err);
      return res.status(400).json({ message: "Upload error: " + (err.message || err) });
    }
    next();
  });
};

router.put("/profile", protect, handleProfileUploads, updateProfile);
router.delete("/:id", protect, deleteUser);
router.post("/resume/delete", protect, deleteResume);
router.get("/public/:id", getPublicProfile);

module.exports = router;