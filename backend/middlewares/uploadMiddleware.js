const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "careerhub_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    resource_type: "auto", // Allows PDF resumes as raw resources and images as image resources
  },
});

const upload = multer({ storage });

module.exports = upload;