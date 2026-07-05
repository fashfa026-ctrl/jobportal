// ============================================================
// ONE-TIME CLEANUP SCRIPT
// Removes Application/SavedJob records whose linked Job no longer exists
// (created before the cascade-delete fix was added to deleteJob).
//
// USAGE: run this once from the backend/ folder:
//   node scripts/cleanupOrphans.js
// ============================================================
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB:", mongoose.connection.host);

  const allJobIds = new Set((await Job.find().select("_id")).map((j) => j._id.toString()));

  const allApplications = await Application.find().select("_id job");
  const orphanApplicationIds = allApplications
    .filter((a) => !a.job || !allJobIds.has(a.job.toString()))
    .map((a) => a._id);

  const allSavedJobs = await SavedJob.find().select("_id job");
  const orphanSavedJobIds = allSavedJobs
    .filter((s) => !s.job || !allJobIds.has(s.job.toString()))
    .map((s) => s._id);

  console.log(`Found ${orphanApplicationIds.length} orphaned Application(s) to delete.`);
  console.log(`Found ${orphanSavedJobIds.length} orphaned SavedJob(s) to delete.`);

  if (orphanApplicationIds.length > 0) {
    await Application.deleteMany({ _id: { $in: orphanApplicationIds } });
    console.log("Deleted orphaned applications.");
  }
  if (orphanSavedJobIds.length > 0) {
    await SavedJob.deleteMany({ _id: { $in: orphanSavedJobIds } });
    console.log("Deleted orphaned saved jobs.");
  }

  console.log("Cleanup complete.");
  await mongoose.disconnect();
}

cleanup().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
