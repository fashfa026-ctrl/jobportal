const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ FIX: use an absolute path resolved from this file's location, not a
// relative "uploads/" path (which depends on process.cwd() — the directory
// Node was launched from — and breaks if the server is started from
// anywhere other than backend/).
const uploadsDir = process.env.VERCEL
  ? "/tmp"
  : path.join(__dirname, "..", "uploads");

if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, and .pdf formats are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;