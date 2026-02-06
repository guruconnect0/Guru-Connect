const express = require("express");
const router = express.Router();

const {
  createBooking,
  updateBookingStatus,
  joinSession,
  autoCloseSessions
} = require("../controllers/bookingController");

const {
  cancelBooking
} = require("../controllers/cancellation.controller");

const {
  protect,
  mentorOnly,
  candidateOnly
} = require("../middlewares/authMiddleware");

/* =========================
   BOOKINGS
   ========================= */

// Candidate creates booking
router.post("/", protect, candidateOnly, createBooking);

// Mentor confirms / cancels booking
router.patch(
  "/:bookingId/status",
  protect,
  mentorOnly,
  updateBookingStatus
);

// Candidate or Mentor cancels
router.patch(
  "/:bookingId/cancel",
  protect,
  cancelBooking
);

// Join session (mentor or candidate)
router.post(
  "/:bookingId/join",
  protect,
  joinSession
);

module.exports = router;
