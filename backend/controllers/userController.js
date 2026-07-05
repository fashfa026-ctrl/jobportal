const fs = require("fs");
const path = require("path");
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW - Token verify பண்ணி current user return பண்ணும்
exports.getMyProfile = async (req, res) => {
  try {
    // Support hardcoded admin login without a User document.
    if (req.user && req.user.role === "admin") {
      return res.json(req.user);
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, companyName, companyDescription } = req.body;

    if (fullName) user.fullName = fullName;

    if (req.files?.avatar) {
      user.avatar = `/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.resume) {
      user.resume = `/uploads/${req.files.resume[0].filename}`;
    }
    if (req.files?.companyLogo) {
      user.companyLogo = `/uploads/${req.files.companyLogo[0].filename}`;
    }

    if (user.role === "employer") {
  if (companyName) user.companyName = companyName;
  if (companyDescription) user.companyDescription = companyDescription;
  if (req.body.companyLocation !== undefined) user.companyLocation = req.body.companyLocation;
  if (req.body.companyWebsite !== undefined) user.companyWebsite = req.body.companyWebsite;
  if (req.body.companyPhone !== undefined) user.companyPhone = req.body.companyPhone;
}

    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      companyLocation: user.companyLocation || "",
      companyWebsite: user.companyWebsite || "",
      companyPhone: user.companyPhone || "",
      resume: user.resume || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resume) {
      const filePath = path.join(__dirname, "..", user.resume);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.resume = "";
    await user.save();
    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role !== "admin" && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this user" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};