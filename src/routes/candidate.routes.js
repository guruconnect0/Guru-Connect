const express = require("express");
const router = express.Router();

const {
  createCandidateProfile,
  getCandidateProfile
} = require("../controllers/candidateController");

const { protect, candidateOnly } = require("../middlewares/authMiddleware");

// CREATE candidate profile
router.post(
  "/profile",
  protect,
  candidateOnly,
  createCandidateProfile
);

// GET candidate profile
router.get(
  "/profile",
  protect,
  candidateOnly,
  getCandidateProfile
);

module.exports = router;
