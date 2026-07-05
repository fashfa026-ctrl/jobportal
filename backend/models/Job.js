const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      required: true,
    },

    location: {
      type: String,
    },

    category: {
        type: String 
    },

    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote" , "Contract"],
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }, //Employer

    salaryMin: {
      type: Number,
    },

    salaryMax: {
        type: Number,
    },

    isClosed: {
        type:Boolean,
        default: false,
    },

    // ✅ NEW: soft-delete flag (LinkedIn/Indeed style) — job record is kept
    // forever so existing applications/history stay intact, but it's hidden
    // from public job listings.
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW: timestamp of when the job was soft-deleted (null if active)
    deletedAt: {
      type: Date,
      default: null,
    },

    deadline: {
      type: Date,
    },

    experience: {
      type: String,
    },

    applicationCount: {
      type: Number,
      default: 0,
    },

    // 💡 NEW: tracks how many times this job's detail page has been viewed
    views: {
      type: Number,
      default: 0,
    },

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);