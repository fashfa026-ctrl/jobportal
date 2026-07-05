const Analytics = require("../models/Analytics");
const Application = require("../models/Application");
const Job = require("../models/Job");

// Helper function to calculate percentage trend
const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

// @desc Get employer analytics
exports.getEmployerAnalytics = async (req, res) => {
  try {
    // 1. Check employer authorization
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const companyId = req.user._id;

    // 2. Setup date ranges for 7-day trend analysis
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);

    const prev7Days = new Date(now);
    prev7Days.setDate(now.getDate() - 14);

    // ==========================================
    // JOB METRICS & TRENDS
    // ==========================================
    const totalActiveJobs = await Job.countDocuments({
      company: companyId,
      isClosed: false,
    });

    // Fetch all jobs belonging to this employer to filter applications
    const jobs = await Job.find({ company: companyId }).select("_id").lean();
    const jobIds = jobs.map((job) => job._id);

    // Baseline calculation for job trends (comparing total jobs vs closed jobs, or historical if needed)
    // For this dashboard, we'll set a placeholder or standard trend value
    const activeJobTrend = 0; 

    // ==========================================
    // APPLICATION METRICS & TRENDS
    // ==========================================
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const recentApplicationsCount = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: last7Days, $lte: now },
    });

    const previousApplicationsCount = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: prev7Days, $lt: last7Days },
    });

    const applicantTrend = getTrend(recentApplicationsCount, previousApplicationsCount);

    // ==========================================
    // ACCEPTED CANDIDATES METRICS & TRENDS
    // ==========================================
    const totalAccepted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "accepted",
    });

    const acceptedLast7 = await Application.countDocuments({
      job: { $in: jobIds },
      status: "accepted",
      createdAt: { $gte: last7Days, $lte: now },
    });

    const acceptedPrev7 = await Application.countDocuments({
      job: { $in: jobIds },
      status: "accepted",
      createdAt: { $gte: prev7Days, $lt: last7Days },
    });

    const acceptedTrend = getTrend(acceptedLast7, acceptedPrev7);

    // ==========================================
    // DATA LISTS (RECENT JOBS & RECENT APPLICATIONS)
    // ==========================================
    const recentJobs = await Job.find({ company: companyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title location type createdAt isClosed");

    // Exact query logic matching lines 84-89 in the screenshot
    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("applicant", "fullName email avatar")
      .populate("job", "title");

    // ==========================================
    // RESPONSE STRUCTURE (Matches lines 91-106 in the image)
    // ==========================================
    res.json({
      counts: {
        totalActiveJobs,
        totalApplications,
        totalAccepted,
        totalHired: totalAccepted,
      },
      trends: {
        activeJobs: activeJobTrend,
        totalApplicants: applicantTrend,
        acceptedCandidates: acceptedTrend,
        totalHired: acceptedTrend,
      },
      data: {
        recentJobs,
        recentApplications,
      },
    });

  } catch (err) {
    // Error block matching lines 107-110 in the image
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: err.message,
    });
  }
};