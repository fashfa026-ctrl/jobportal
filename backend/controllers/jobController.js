const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// @desc   Create a new job (Employer only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }
    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all jobs (with search & filter + isSaved + applicationStatus)
exports.getJobs = async (req, res) => {
  const {
    keyword,
    location,
    category,
    type,
    minSalary,
    maxSalary,
    userId,
  } = req.query;

  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
    ...(userId && { company: userId }), // ✅ employer → company
  };

  if (minSalary || maxSalary) {
    query.$and = [
      ...(minSalary ? [{ salaryMin: { $gte: Number(minSalary) } }] : []),
      ...(maxSalary ? [{ salaryMax: { $lte: Number(maxSalary) } }] : []),
    ];
  }

  try {
    const jobs = await Job.find(query)
      .populate("company", "name companyName companyLogo companyDescription companyLocation companyWebsite companyPhone")

    let savedJobIds = [];
    let applicationMap = {};

    if (req.user) {
      const savedJobs = await SavedJob.find({ jobseeker: req.user._id });
      savedJobIds = savedJobs.map((s) => s.job.toString());

      const applications = await Application.find({ applicant: req.user._id });
      applications.forEach((app) => {
        applicationMap[app.job.toString()] = app.status;
      });
    }

    const jobsWithStatus = await Promise.all(
      jobs.map(async (job) => {
        // Dynamic sync/healing of applicationCount
        const actualCount = await Application.countDocuments({ job: job._id });
        if (job.applicationCount !== actualCount) {
          job.applicationCount = actualCount;
          await job.save();
        }

        return {
          ...job.toObject(),
          isSaved: savedJobIds.includes(job._id.toString()),
          applicationStatus: applicationMap[job._id.toString()] || null,
        };
      })
    );

    res.json(jobsWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get jobs for logged in user (Employer can see posted jobs)
exports.getJobsEmployer = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id })
      .populate("company", "name companyName companyLogo companyDescription companyLocation companyWebsite companyPhone")

    // Dynamic sync/healing of applicationCounts in parallel
    const jobsWithStatus = await Promise.all(
      jobs.map(async (job) => {
        const actualCount = await Application.countDocuments({ job: job._id });
        if (job.applicationCount !== actualCount) {
          job.applicationCount = actualCount;
          await job.save();
        }
        return job;
      })
    );

    res.json(jobsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    // 💡 NEW: increment the view counter every time this job is opened
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    ).populate("company", "name companyName companyLogo companyDescription companyLocation companyWebsite companyPhone")

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Dynamic sync/healing of applicationCount
    const actualCount = await Application.countDocuments({ job: job._id });
    if (job.applicationCount !== actualCount) {
      job.applicationCount = actualCount;
      await job.save();
    }

    let isSaved = false;
    let applicationStatus = null;

    // ✅ FIX: only meaningful for a logged-in jobseeker; uses the correct
    // SavedJob field name (`jobseeker`, not `user`).
    if (req.user) {
      const savedJob = await SavedJob.findOne({
        job: job._id,
        jobseeker: req.user._id,
      });
      isSaved = !!savedJob;

      const application = await Application.findOne({
        job: job._id,
        applicant: req.user._id,
      });
      applicationStatus = application ? application.status : null;
    }

    res.json({ ...job.toObject(), isSaved, applicationStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Update a job (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.company.toString() !== req.user._id.toString()) { // ✅ employer → company
      return res.status(401).json({ message: "Not authorized to update this job" });
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Delete a job (Employer only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.company.toString() !== req.user._id.toString()) { // ✅ employer → company
      return res.status(401).json({ message: "Not authorized to delete this job" });
    }
    // ✅ FIX: cascade-delete related Applications and SavedJob entries so they
    // don't become orphaned records pointing at a non-existent job (this was
    // causing "ghost" applications to appear in the admin Applications list
    // with a deleted job/applicant after a job was removed).
    await Application.deleteMany({ job: job._id });
    await SavedJob.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Toggle job close status (Employer only)
exports.toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.company.toString() !== req.user._id.toString()) { // ✅ employer → company
      return res.status(401).json({ message: "Not authorized to close this job" });
    }
    job.isClosed = !job.isClosed;
    await job.save();
    res.json({
      message: job.isClosed ? "Job closed successfully" : "Job reopened successfully",
      isClosed: job.isClosed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};