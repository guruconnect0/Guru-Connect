const Booking = require("../models/booking");
const Mentor = require("../models/Mentor");
const Transaction = require("../models/Transaction");
const razorpay = require("../config/razorpay");

/* =========================
   CREATE BOOKING
========================= */
exports.createBooking = async (req, res) => {
  try {
    const { mentorId, date, time, duration, sessionType = "demo" } = req.body;
    const candidateId = req.user._id;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor || !mentor.verified)
      return res.status(400).json({ success: false, message: "Mentor unavailable" });

    // 🚨 DEMO REQUIRED BEFORE PAID
    if (sessionType === "paid") {
      const demoCompleted = await Booking.findOne({
        mentorId,
        candidateId,
        sessionType: "demo",
        status: "completed"
      });

      if (!demoCompleted)
        return res.status(400).json({
          success: false,
          message: "Complete demo session first"
        });
    }

    // 🚫 Prevent double booking
    const existingBooking = await Booking.findOne({
      mentorId,
      date,
      time,
      status: { $in: ["pending", "confirmed", "awaiting-payment", "in-progress"] }
    });

    if (existingBooking)
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });

    let amount = 0;
    let commissionAmount = 0;
    let mentorEarning = 0;

    if (sessionType === "paid") {
      amount = mentor.hourlyRate * (duration / 60);
      commissionAmount = amount * 0.2;
      mentorEarning = amount - commissionAmount;
    }

    const booking = await Booking.create({
      mentorId,
      candidateId,
      date,
      time,
      duration,
      sessionType,
      amount,
      commissionAmount,
      mentorEarning,
      status: "pending",
      paymentStatus: sessionType === "paid" ? "unpaid" : "not-required",
      expiresAt:
        sessionType === "paid"
          ? new Date(Date.now() + 10 * 60 * 1000)
          : null
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =========================
   MENTOR ACCEPT / REJECT
========================= */
exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { action } = req.body;

  const booking = await Booking.findById(bookingId).populate("mentorId");

  if (!booking)
    return res.status(404).json({ success: false });

  if (booking.mentorId.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false });

  if (action === "accept") {
    booking.status =
      booking.sessionType === "paid"
        ? "awaiting-payment"
        : "confirmed";
  }

  if (action === "reject") {
    booking.status = "cancelled";
  }

  await booking.save();
  res.json({ success: true, booking });
};

/* =========================
   JOIN SESSION
========================= */
exports.joinSession = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking || booking.status !== "confirmed")
    return res.status(400).json({ success: false });

  const now = new Date();
  booking.attendance = booking.attendance || {};

  if (req.user.role === "mentor")
    booking.attendance.mentorJoinedAt = now;
  else
    booking.attendance.candidateJoinedAt = now;

  booking.status = "in-progress";
  await booking.save();

  res.json({ success: true });
};

/* =========================
   AUTO CLOSE + EXPIRY
========================= */
exports.autoCloseSessions = async () => {
  const now = new Date();

  // Expire unpaid bookings
  const expired = await Booking.find({
    status: "awaiting-payment",
    paymentStatus: "unpaid",
    expiresAt: { $lte: now }
  });

  for (const booking of expired) {
    booking.status = "cancelled";
    await booking.save();
  }

  // Close completed sessions
  const sessions = await Booking.find({
    status: "in-progress"
  }).populate("mentorId");

  for (const booking of sessions) {
    const start = new Date(
      `${booking.date.toISOString().split("T")[0]}T${booking.time}`
    );
    const end = new Date(start.getTime() + booking.duration * 60000);

    if (now > end) {
      const mentorJoined = booking.attendance?.mentorJoinedAt;
      const candidateJoined = booking.attendance?.candidateJoinedAt;

      if (mentorJoined && candidateJoined) {
        booking.status = "completed";

        if (
          booking.sessionType === "paid" &&
          booking.paymentStatus === "paid" &&
          !booking.walletCredited
        ) {
          const mentor = booking.mentorId;

          mentor.walletBalance += booking.mentorEarning;
          mentor.totalEarnings += booking.mentorEarning;

          await mentor.save();

          await Transaction.create({
            mentorId: mentor._id,
            bookingId: booking._id,
            type: "credit",
            amount: booking.mentorEarning
          });

          booking.walletCredited = true;
        }
      } else {
        booking.status = "cancelled";
      }

      await booking.save();
    }
  }
};