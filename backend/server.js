require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobsRoutes = require("./routes/savedJobRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const statsRoutes = require("./routes/statsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Middleware
app.use(express.json());

// ✅ FIX: auto-create the uploads/ folder on startup if it doesn't exist yet.
// Multer's diskStorage throws ENOENT (which surfaces as a 500) if this
// directory is missing — this guarantees it always exists.
const uploadsDir = process.env.VERCEL ? "/tmp" : path.join(__dirname, "uploads");
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created missing uploads/ directory");
}

// ✅ Uploads folder serve செய்கிறோம்
app.use("/uploads", express.static(uploadsDir));

// 🔍 Request logger (helps confirm requests are reaching the server)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reviews", reviewRoutes);

// Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;