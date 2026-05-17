const express = require("express");
const router = express.Router();
const { protect, candidateOnly } = require("../middlewares/authMiddleware");
const { createReview, getMentorReviews } = require("../controllers/review.controller");

router.post("/", protect, candidateOnly, createReview);
router.get("/mentor/:mentorId", getMentorReviews);

module.exports = router;
