const express = require("express");
const router = express.Router();

const { createMentorProfile,getMentorProfile, searchMentors } = require("../controllers/mentorController");
const { protect, mentorOnly } = require("../middlewares/authMiddleware");
const { getMentorTest,submitMentorTest } = require("../controllers/mentorTestController");
const { getAvailableSlots } = require("../controllers/mentorSlots.controller");

router.post(
  "/profile",
  protect,
  mentorOnly,
  createMentorProfile
);
router.get("/profile", protect, mentorOnly, getMentorProfile);
router.get("/search", protect, searchMentors);

router.get(
  "/test",
  protect,
  mentorOnly,
  getMentorTest
);
router.post(
  "/test/submit",
  protect,
  mentorOnly,
  submitMentorTest
);
router.get("/:mentorId/slots", getAvailableSlots);

module.exports = router;
