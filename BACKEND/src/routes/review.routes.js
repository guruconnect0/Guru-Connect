const express = require("express");
const router = express.Router();
const { protect, candidateOnly } = require("../middlewares/authMiddleware");
const { createReview } = require("../controllers/review.controller");

router.post("/", protect, candidateOnly, createReview);

module.exports = router;
