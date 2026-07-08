const Feedback = require("../models/Feedback");

// @desc    Create a contact/feedback message
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all feedback messages (Admin Only)
// @route   GET /api/feedback/admin
// @access  Private (Admin Only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort("-createdAt");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update feedback status (Admin Only)
// @route   PATCH /api/feedback/admin/:id
// @access  Private (Admin Only)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["new", "read"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.status = status;
    await feedback.save();

    res.json({
      message: `Feedback marked as ${status}`,
      feedback,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
