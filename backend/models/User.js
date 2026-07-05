const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["jobseeker", "employer", "admin"],
    required: true,
    default: "jobseeker",
  },
  isBlocked: { type: Boolean, default: false }, // ✅ NEW
  avatar: { type: String, default: "" },
  resume: { type: String, default: "" },
  companyName: { type: String, default: "" },
  companyDescription: { type: String, default: "" },
  companyLogo: { type: String, default: "" },
  companyLocation: { type: String, default: "" },  // ✅ புதுசு
companyWebsite: { type: String, default: "" },   // ✅ புதுசு
companyPhone: { type: String, default: "" },     // ✅ புதுசு
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpire: { type: Date, default: null },
  // ✅ NEW — OTP-based password reset fields
  resetPasswordOTP: { type: String, default: "" },
  resetPasswordOTPExpire: { type: Date, default: null },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);