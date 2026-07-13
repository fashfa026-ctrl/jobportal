const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendApplicationStatusEmail } = require("./authController");

// @desc   Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

   const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
    });

    await Job.findByIdAndUpdate(req.params.jobId, {
      $inc: { applicationCount: 1 }
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get logged-in user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title location type salaryMin salaryMax company");

    const validApplications = applications.filter((app) => app.job !== null);
    res.json(validApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all applicants for a job (Employer)
exports.getApplicantsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "fullName email avatar resume")
      .populate("job", "title location type category");
      res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get application by ID (Jobseeker or Employer)
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title")
      .populate("applicant", "fullName email avatar resume");

    if (!app) {
      return res.status(404).json({ message: "Application not found.", id: req.params.id });
    }

    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Not authorized to view this application" });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Update application status (Employer only)
exports.updateStatus = async (req, res) => {
  try {
    const { status, interviewDetails } = req.body;

    const app = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "fullName email");

    if (!app || app.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    app.status = status;

    if (status === "accepted") {
      if (interviewDetails) {
        app.interviewDetails = interviewDetails;
        if (interviewDetails.date) {
          app.interviewDetails.date = new Date(interviewDetails.date);
        }
      }
    } else {
      app.interviewDetails = {};
    }

    await app.save();

    // ✅ Send email notification when status becomes accepted or rejected
    if (status === "accepted" || status === "rejected") {
      const companyName = req.user.companyName || "the company";
      await sendApplicationStatusEmail({
        to: app.applicant.email,
        applicantName: app.applicant.fullName,
        jobTitle: app.job.title,
        companyName,
        status,
        interviewDetails: app.interviewDetails, // ✅ NEW — pass interview details for accepted emails
      });
    }

    res.json({ message: "Application status updated", application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};