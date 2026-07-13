const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const User = require("../models/User");

async function sync() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/careerhub";
  console.log("Connecting to MongoDB:", uri);
  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.host);

  // 1. Get all active User IDs and Job IDs
  const allUsers = await User.find().select("_id email role");
  const allJobs = await Job.find().select("_id title company");

  const userIds = new Set(allUsers.map((u) => u._id.toString()));
  const jobIds = new Set(allJobs.map((j) => j._id.toString()));

  console.log(`\n--- DATABASE SUMMARY ---`);
  console.log(`Total Users: ${allUsers.length}`);
  console.log(`Total Jobs: ${allJobs.length}`);
  console.log(`------------------------\n`);

  // 2. Clean up orphaned Jobs (whose company/employer doesn't exist)
  const orphanJobs = allJobs.filter((job) => !job.company || !userIds.has(job.company.toString()));
  console.log(`Found ${orphanJobs.length} orphaned Job(s) (owner user deleted).`);
  if (orphanJobs.length > 0) {
    const orphanJobIds = orphanJobs.map((j) => j._id);
    await Job.deleteMany({ _id: { $in: orphanJobIds } });
    await Application.deleteMany({ job: { $in: orphanJobIds } });
    await SavedJob.deleteMany({ job: { $in: orphanJobIds } });
    console.log("Deleted orphaned jobs and their associated applications/saved-jobs.");
    
    // Refresh active job IDs set
    const updatedJobs = await Job.find().select("_id");
    jobIds.clear();
    updatedJobs.forEach((j) => jobIds.add(j._id.toString()));
  }

  // 3. Clean up orphaned Applications
  const allApplications = await Application.find().select("_id job applicant");
  const orphanApplications = allApplications.filter((app) => {
    const jobExists = app.job && jobIds.has(app.job.toString());
    const applicantExists = app.applicant && userIds.has(app.applicant.toString());
    return !jobExists || !applicantExists;
  });

  console.log(`Found ${orphanApplications.length} orphaned Application(s) (either job or applicant user deleted).`);
  if (orphanApplications.length > 0) {
    const orphanAppIds = orphanApplications.map((a) => a._id);
    await Application.deleteMany({ _id: { $in: orphanAppIds } });
    console.log("Deleted orphaned applications.");
  }

  // 4. Clean up orphaned SavedJobs
  const allSavedJobs = await SavedJob.find().select("_id job jobseeker");
  const orphanSavedJobs = allSavedJobs.filter((sj) => {
    const jobExists = sj.job && jobIds.has(sj.job.toString());
    const userExists = sj.jobseeker && userIds.has(sj.jobseeker.toString());
    return !jobExists || !userExists;
  });

  console.log(`Found ${orphanSavedJobs.length} orphaned SavedJob(s) (either job or jobseeker user deleted).`);
  if (orphanSavedJobs.length > 0) {
    const orphanSavedIds = orphanSavedJobs.map((s) => s._id);
    await SavedJob.deleteMany({ _id: { $in: orphanSavedIds } });
    console.log("Deleted orphaned saved jobs.");
  }

  // 5. Recalculate applicationCount for all remaining jobs
  console.log("\nUpdating applicationCount for all active jobs...");
  const activeJobs = await Job.find();
  let updatedCount = 0;

  for (const job of activeJobs) {
    const actualCount = await Application.countDocuments({ job: job._id });
    if (job.applicationCount !== actualCount) {
      console.log(`Job "${job.title}": updating applicationCount from ${job.applicationCount} to ${actualCount}`);
      job.applicationCount = actualCount;
      await job.save();
      updatedCount++;
    } else {
      console.log(`Job "${job.title}": count is already correct (${actualCount})`);
    }
  }

  console.log(`\nUpdated ${updatedCount} job count(s).`);
  console.log("Sync and cleanup complete.");
  await mongoose.disconnect();
}

sync().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
