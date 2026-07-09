const express = require("express");
const { createReview, getAllReviews } = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/", getAllReviews);

module.exports = router;
