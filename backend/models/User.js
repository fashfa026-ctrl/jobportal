const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["jobseeker", "employer", "admin"],
    required: true,
    default: "jobseeker",
  },
  isBlocked: { type: Boolean, default: false }, // ✅ NEW
  avatar: { type: String, default: "" },
  resume: { type: String, default: "" },
  companyName: { type: String, default: "" },
  companyDescription: { type: String, default: "" },
  companyLogo: { type: String, default: "" },
  companyLocation: { type: String, default: "" },  // ✅ புதுசு
companyWebsite: { type: String, default: "" },   // ✅ புதுசு
companyPhone: { type: String, default: "" },     // ✅ புதுசு
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpire: { type: Date, default: null },
  // ✅ NEW — OTP-based password reset fields
  resetPasswordOTP: { type: String, default: "" },
  resetPasswordOTPExpire: { type: Date, default: null },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete associated applications, saved jobs, and employer jobs when a user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const mongoose = require("mongoose");
    const Application = mongoose.model("Application");
    const SavedJob = mongoose.model("SavedJob");
    const Job = mongoose.model("Job");

    console.log(`Cascade deleting data for user: ${this._id} (${this.email})`);

    // 1. Delete user's own applications and saved jobs
    await Application.deleteMany({ applicant: this._id });
    await SavedJob.deleteMany({ jobseeker: this._id });

    // 2. If the user is an employer, delete all posted jobs and their associated applications/saved jobs
    if (this.role === "employer") {
      const jobs = await Job.find({ company: this._id });
      const jobIds = jobs.map((job) => job._id);

      if (jobIds.length > 0) {
        await Application.deleteMany({ job: { $in: jobIds } });
        await SavedJob.deleteMany({ job: { $in: jobIds } });
        await Job.deleteMany({ company: this._id });
        console.log(`Deleted ${jobIds.length} jobs and their applications posted by employer ${this._id}`);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);