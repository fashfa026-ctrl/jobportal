const Review = require("../models/Review");

// @desc    Create or Update a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    // Check if user already reviewed
    let review = await Review.findOne({ user: userId });

    if (review) {
      // Update existing review
      review.rating = numRating;
      review.comment = comment;
      await review.save();
      return res.status(200).json({ message: "Review updated successfully", review });
    } else {
      // Create new review
      review = new Review({
        user: userId,
        rating: numRating,
        comment,
      });
      await review.save();
      return res.status(201).json({ message: "Review created successfully", review });
    }
  } catch (error) {
    console.error("Create Review Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "fullName")
      .sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Get All Reviews Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
};
