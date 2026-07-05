const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resume: {
      type: String,
    },

    status: {
      type: String,
      enum: ["applied", "in review", "accepted", "rejected"],
      default: "applied",
    },

    interviewDetails: {
      title: String,
      type: {
        type: String,
        enum: ["Online", "Physical"],
        default: "Physical",
      },
      location: String,
      date: Date,
      time: String,
      schedule: [
        {
          title: String,
          startTime: String,
          endTime: String,
        },
      ],
      documents: [String],
      contact: {
        name: String,
        position: String,
        email: String,
        phone: String,
      },
      meetingLink: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);