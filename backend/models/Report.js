const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional, since guest users can also report
    },
    reason: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "reviewed", "dismissed"],
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: true } }
);

module.exports = mongoose.model("Report", reportSchema);
