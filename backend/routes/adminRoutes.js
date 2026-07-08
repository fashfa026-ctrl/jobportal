const express = require("express");
const {
  getAdminDashboard,
  getAllUsers,
  updateUserRole,
  deleteUser,
  toggleBlockUser, // ✅ NEW
  getAllJobs,
  updateJob,
  deleteJob,
  getAllApplications,
  toggleJobStatus,
} = require("../controllers/adminController");
const { getAllReports, updateReportStatus } = require("../controllers/reportController");
const { getAllFeedback, updateFeedbackStatus } = require("../controllers/feedbackController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, admin, getAdminDashboard);
router.get("/users", protect, admin, getAllUsers);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.put("/users/:id/block", protect, admin, toggleBlockUser); // ✅ NEW
router.delete("/users/:id", protect, admin, deleteUser);
router.get("/jobs", protect, admin, getAllJobs);
router.put("/jobs/:id/toggle", protect, admin, toggleJobStatus);
router.put("/jobs/:id", protect, admin, updateJob);
router.delete("/jobs/:id", protect, admin, deleteJob);
router.get("/applications", protect, admin, getAllApplications);
router.get("/reports", protect, admin, getAllReports);
router.patch("/reports/:id", protect, admin, updateReportStatus);
router.get("/feedback", protect, admin, getAllFeedback);
router.patch("/feedback/:id", protect, admin, updateFeedbackStatus);

module.exports = router;