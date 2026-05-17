const express = require("express");
const router = express.Router();

const {
  createBooking,
  updateBookingStatus,
  joinSession,
  completeSession,
  autoCloseSessions,
  getMyBookings
} = require("../controllers/bookingController");

const { cancelBooking } =
  require("../controllers/cancellation.controller");

const {
  protect,
  mentorOnly,
  candidateOnly,
  adminOnly
} = require("../middlewares/authMiddleware");

/* =========================
   BOOKINGS
========================= */

// Get my bookings (candidate or mentor)
router.get(
  "/my",
  protect,
  getMyBookings
);

// Candidate creates booking
router.post(
  "/",
  protect,
  candidateOnly,
  createBooking
);

// Mentor accepts / rejects booking
router.patch(
  "/:bookingId/status",
  protect,
  mentorOnly,
  updateBookingStatus
);

// Cancel booking (mentor or candidate)
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

// Complete session (mentor only)
router.patch(
  "/:bookingId/complete",
  protect,
  mentorOnly,
  completeSession
);

/* =========================
   ADMIN UTILITIES (Optional)
========================= */


module.exports = router;