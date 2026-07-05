const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await User.countDocuments({ role: "employer" });
    const totalJobSeekers = await User.countDocuments({ role: "jobseeker" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    // ✅ CHANGED: only count active (non soft-deleted) jobs, so the dashboard
    // total reflects jobs that are actually live/visible, not removed ones.
    const totalJobs = await Job.countDocuments({ isDeleted: { $ne: true } });
    const totalApplications = await Application.countDocuments();
    const totalAccepted = await Application.countDocuments({ status: "accepted" });
    const totalRejected = await Application.countDocuments({ status: "rejected" });
    const totalPending = await Application.countDocuments({ status: { $in: ["applied", "in review"] } });

    const recentUsers = await User.find()
      .select("fullName email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // ✅ CHANGED: recent jobs widget should also only show active jobs
    const recentJobs = await Job.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("company", "companyName fullName email");

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("job", "title")
      .populate("applicant", "fullName email");

    res.json({
      counts: {
        totalUsers,
        totalEmployers,
        totalJobSeekers,
        totalAdmins,
        totalJobs,
        totalApplications,
        totalAccepted,
        totalRejected,
        totalPending,
      },
      recentUsers,
      recentJobs,
      recentApplications,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["jobseeker", "employer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully", user: user.toObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW — Block / Unblock user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ CHANGED: Soft delete (LinkedIn/Indeed style) — instead of hard-deleting
    // the job and cascading deletes to Applications/SavedJob, mark the job as
    // deleted and closed. This keeps applicant history intact (their
    // application status, etc.) even after an admin removes the listing.
    // The job stops appearing in public job listings (see jobController's
    // getJobs isDeleted filter), but admin can still see it via getAllJobs.
    job.isDeleted = true;
    job.isClosed = true;
    job.deletedAt = new Date();
    await job.save();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    // Intentionally NOT filtering isDeleted here — admin should still be able
    // to see soft-deleted jobs in the admin Jobs table (with a "Deleted"
    // badge on the frontend) for record-keeping/audit purposes.
    const jobs = await Job.find()
      .populate("company", "companyName fullName email companyLogo avatar")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.isClosed = !job.isClosed;
    await job.save();

    res.json({ message: "Job status updated", isClosed: job.isClosed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title")
      .populate("applicant", "fullName email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};