const Report = require("../models/Report");
const Job = require("../models/Job");

// @desc    Create a job report
// @route   POST /api/reports
// @access  Public (Optional Authentication)
exports.createReport = async (req, res) => {
  try {
    const { jobId, reason } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Verify job exists
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ message: "Job not found" });
    }

    const reportData = {
      job: jobId,
      reason: reason || "",
    };

    // If user is authenticated, attach reporter ID
    if (req.user) {
      reportData.reportedBy = req.user._id;
    }

    const report = await Report.create(reportData);

    res.status(201).json({
      message: "Job reported successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all reports (Admin Only)
// @route   GET /api/reports/admin
// @access  Private (Admin Only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("job", "title")
      .populate("reportedBy", "fullName email")
      .sort("-createdAt");

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update report status (Admin Only)
// @route   PATCH /api/reports/admin/:id
// @access  Private (Admin Only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "reviewed", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json({
      message: `Report status updated to ${status}`,
      report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
