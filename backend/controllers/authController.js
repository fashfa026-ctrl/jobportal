const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

exports.sendApplicationStatusEmail = async ({ to, applicantName, jobTitle, companyName, status, interviewDetails }) => {
  try {
    const transporter = getTransporter();

    const isAccepted = status === "accepted";
    const statusColor = isAccepted ? "#16A34A" : "#DC2626";
    const statusText = isAccepted ? "Accepted" : "Not Selected";
    const headerMessage = isAccepted
      ? "Congratulations! Your application has been accepted."
      : "Thank you for your interest. Unfortunately, you were not selected for this role.";

    let interviewHtml = "";
    if (isAccepted && interviewDetails && interviewDetails.date) {
      const formattedDate = moment(interviewDetails.date).format("DD MMM YYYY");
      const mode = interviewDetails.type || interviewDetails.mode || "Online";

      interviewHtml = `
        <div style="margin: 20px 0; padding: 16px; background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; color: #5B21B6; font-size: 15px;">📅 Interview Invitation</h3>
          ${interviewDetails.location ? `<p style="margin: 4px 0;"><strong>Location:</strong> ${interviewDetails.location}</p>` : ""}
          <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDate}${interviewDetails.time ? ` at ${interviewDetails.time}` : ""}</p>
          <p style="margin: 4px 0;"><strong>Mode:</strong> ${mode}</p>
          ${interviewDetails.meetingLink ? `<p style="margin: 4px 0;"><strong>Meeting Link:</strong> <a href="${interviewDetails.meetingLink}" style="color: #5B21B6;">${interviewDetails.meetingLink}</a></p>` : ""}
          ${interviewDetails.documents && interviewDetails.documents.length > 0 ? `
            <p style="margin: 8px 0 4px 0;"><strong>Documents Required:</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              ${interviewDetails.documents.map((d) => `<li style="margin: 2px 0;">${d}</li>`).join("")}
            </ul>
          ` : ""}
          ${interviewDetails.contact && interviewDetails.contact.name ? `
            <p style="margin: 8px 0 4px 0;"><strong>Contact Person:</strong> ${interviewDetails.contact.name}${interviewDetails.contact.position ? ` — ${interviewDetails.contact.position}` : ""}</p>
          ` : ""}
          ${interviewDetails.notes ? `<p style="margin: 8px 0 0 0; color: #6B7280; font-style: italic;">${interviewDetails.notes}</p>` : ""}
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"CareerHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: `CareerHub - Application Update: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #1E40AF;">Application Status Update</h2>
          <p>Hello <strong>${applicantName}</strong>,</p>
          <p>${headerMessage}</p>
          <div style="margin: 20px 0; padding: 16px; background: #F9FAFB; border-radius: 8px;">
            <p style="margin: 4px 0;"><strong>Job:</strong> ${jobTitle}</p>
            <p style="margin: 4px 0;"><strong>Company:</strong> ${companyName}</p>
            <p style="margin: 4px 0;">
              <strong>Status:</strong>
              <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
            </p>
          </div>
          ${interviewHtml}
          <p style="color: #6B7280; font-size: 13px;">Log in to CareerHub to view more details.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">CareerHub Team</p>
        </div>
      `,
    });

    console.log(`✅ Status email sent to ${to} (${status})`);
  } catch (err) {
    console.error("❌ Failed to send status email:", err.message);
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (role === "admin") {
      return res.status(403).json({
        message: "Admin users must be created by an existing administrator",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatar = req.file ? req.file.path : "";

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      avatar,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
        resume: user.resume || "",
      },
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@careerhub.com" && password === "Admin@123") {
      return res.status(200).json({
        token: generateToken("admin"),
        user: {
          _id: "admin",
          fullName: "Admin",
          email: "admin@careerhub.com",
          role: "admin",
          avatar: "",
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: {
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
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// ✅ STEP 1: Generate a 6-digit OTP and email it to the user (replaces the reset-link flow)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (email === "admin@careerhub.com") {
      return res.status(403).json({
        message: "Admin account password reset is not supported. Please contact the system administrator.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Generate a 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"CareerHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "CareerHub - Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #1E40AF;">CareerHub Password Reset</h2>
          <p>Hello <strong>${user.fullName}</strong>,</p>
          <p>Use the OTP below to reset your password:</p>
          <div style="margin: 24px 0; text-align: center;">
            <span style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #2563EB, #7C3AED); color: white; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="color: #6B7280; font-size: 13px;">This OTP expires in <strong>5 minutes</strong>.</p>
          <p style="color: #6B7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">CareerHub Team</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ STEP 2 (NEW): Verify the OTP without resetting the password yet
// This lets the frontend move from "Enter OTP" screen to "Set New Password" screen
// only after confirming the OTP is correct, without exposing whether emails exist.
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ STEP 3: Reset the password using email + OTP (instead of a URL token)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordOTP = "";
    user.resetPasswordOTPExpire = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};