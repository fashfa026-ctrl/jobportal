const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

router.get("/", async (req, res) => {
  try {
    // 1. 👥 Active Users
    const totalUsers = await User.countDocuments({
      role: { $in: ["jobseeker", "employer"] },
    });

    // 2. 🏢 Companies
    const totalCompanies = await User.countDocuments({
      role: "employer",
      companyName: { $exists: true, $ne: "" },
    });

    // 3. 💼 Jobs Posted
    const totalJobs = await Job.countDocuments();

    // 4. 📄 Total Applications
    const totalApplications = await Application.countDocuments();

    // 💡 Total views across all jobs (for View-to-Apply Rate)
    const jobs = await Job.find({}, "views");
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

    // 💡 View-to-Apply Rate
    let viewToApplyRate = 0;
    if (totalViews > 0) {
      viewToApplyRate = (totalApplications / totalViews) * 100;
      if (viewToApplyRate > 100) {
        console.warn(
          `[stats] View-to-Apply Rate computed as ${viewToApplyRate.toFixed(
            1
          )}% (>100%). This means totalApplications (${totalApplications}) > totalViews (${totalViews}). ` +
            `Check that job view counts are being incremented when a job is opened.`
        );
        viewToApplyRate = 100;
      }
    }
    viewToApplyRate = viewToApplyRate.toFixed(1);

    // 💡 Acceptance Rate
    const acceptedCount = await Application.countDocuments({ status: "accepted" });
    const acceptanceRate =
      totalApplications > 0
        ? ((acceptedCount / totalApplications) * 100).toFixed(1)
        : "0.0";

    // 💡 Today's Applications (replaces Rejection Rate)
    // Counts applications created since midnight today (server local time).
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysApplications = await Application.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    res.json({
      users: totalUsers,
      companies: totalCompanies,
      jobs: totalJobs,
      applications: totalApplications,
      viewToApplyRate, // e.g. "12.5"
      acceptanceRate, // e.g. "20.0"
      todaysApplications, // e.g. 3
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;