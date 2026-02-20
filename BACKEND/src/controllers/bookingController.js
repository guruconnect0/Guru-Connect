const Booking = require("../models/booking");
const Mentor = require("../models/Mentor");

/**
 * =========================
 * CREATE BOOKING (CANDIDATE)
 * =========================
 */
exports.createBooking = async (req, res, next) => {
  try {
    const { mentorId, date, time, duration, sessionType = "demo" } = req.body;
    const candidateId = req.user._id;

    /* 1️⃣ Mentor must exist & be verified */
    const mentor = await Mentor.findById(mentorId);
    if (!mentor || !mentor.verified) {
      return res.status(400).json({
        success: false,
        message: "Mentor not available for booking"
      });
    }

    /* 2️⃣ Validate future date */
    const sessionStart = new Date(`${date}T${time}`);
    if (sessionStart < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book past time"
      });
    }

    const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);
const day = sessionStart
  .toLocaleString("en-US", { weekday: "long" })
  .toLowerCase();
    /* 3️⃣ DEMO RULES */
    if (sessionType === "demo") {
      if (duration > 15) {
        return res.status(400).json({
          success: false,
          message: "Demo session cannot exceed 15 minutes"
        });
      }

      const existingDemo = await Booking.findOne({
        mentorId,
        candidateId,
        sessionType: "demo",
        status: { $ne: "cancelled" }
      });

      if (existingDemo) {
        return res.status(403).json({
          success: false,
          message: "You already took a demo with this mentor"
        });
      }
    }

    /* 4️⃣ PAID SESSION RULE */
    if (sessionType === "paid") {
      const completedDemo = await Booking.findOne({
        mentorId,
        candidateId,
        sessionType: "demo",
        status: "completed"
      });

      if (!completedDemo) {
        return res.status(403).json({
          success: false,
          message: "You must complete a demo before booking a paid session"
        });
      }
    }

    /* 5️⃣ Mentor availability check */
 const available = mentor.availability.some(slot =>
  slot.day.toLowerCase() === day &&
  time >= slot.startTime &&
  formatTime(sessionEnd) <= slot.endTime
);

    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Mentor not available in this time slot"
      });
    }

    /* 6️⃣ Prevent mentor overlapping bookings */
    const mentorConflict = await Booking.findOne({
      mentorId,
      date,
      status: { $in: ["pending", "confirmed", "in-progress"] }
    });

    if (mentorConflict) {
      const existingStart = new Date(
        `${mentorConflict.date.toISOString().split("T")[0]}T${mentorConflict.time}`
      );
      const existingEnd = new Date(
        existingStart.getTime() + mentorConflict.duration * 60000
      );

      if (sessionStart < existingEnd && sessionEnd > existingStart) {
        return res.status(409).json({
          success: false,
          message: "This slot is already booked"
        });
      }
    }

    /* 7️⃣ Prevent candidate overlapping bookings */
    const candidateConflict = await Booking.findOne({
      candidateId,
      date,
      status: { $in: ["pending", "confirmed", "in-progress"] }
    });

    if (candidateConflict) {
      const existingStart = new Date(
        `${candidateConflict.date.toISOString().split("T")[0]}T${candidateConflict.time}`
      );
      const existingEnd = new Date(
        existingStart.getTime() + candidateConflict.duration * 60000
      );

      if (sessionStart < existingEnd && sessionEnd > existingStart) {
        return res.status(409).json({
          success: false,
          message: "You already have another session at this time"
        });
      }
    }

    /* 8️⃣ Limit pending bookings */
    const pendingCount = await Booking.countDocuments({
      candidateId,
      status: "pending"
    });

    if (pendingCount >= 3) {
      return res.status(403).json({
        success: false,
        message: "Complete existing bookings before creating new ones"
      });
    }

    /* 9️⃣ Create booking */
    const booking = await Booking.create({
      mentorId,
      candidateId,
      date,
      time,
      duration,
      sessionType,
      paymentStatus: sessionType === "paid" ? "pending" : "not-required"
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================
 * UPDATE BOOKING STATUS
 * =========================
 */
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId).populate("mentorId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.mentorId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================
 * JOIN SESSION
 * =========================
 */
exports.joinSession = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (
      !booking ||
      !["confirmed", "in-progress"].includes(booking.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unconfirmed session"
      });
    }

    const sessionStart = new Date(
      `${booking.date.toISOString().split("T")[0]}T${booking.time}`
    );
    const sessionEnd = new Date(
      sessionStart.getTime() + booking.duration * 60000
    );
    const now = new Date();

    if (
      now < new Date(sessionStart.getTime() - 10 * 60000) ||
      now > new Date(sessionEnd.getTime() + 10 * 60000)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only join near the session time"
      });
    }

    if (req.user.role === "mentor") {
      if (booking.attendance.mentorJoinedAt) {
        return res.status(400).json({ success: false, message: "Mentor already joined" });
      }
      booking.attendance.mentorJoinedAt = now;
    } else {
      if (booking.attendance.candidateJoinedAt) {
        return res.status(400).json({ success: false, message: "Candidate already joined" });
      }
      booking.attendance.candidateJoinedAt = now;
    }

    booking.status = "in-progress";
    await booking.save();

    res.json({
      success: true,
      message: "Joined session successfully"
    });
  } catch (error) {
    next(error);
  }
};
exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("mentorId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this booking"
      });
    }

    const sessionStart = new Date(
      `${booking.date.toISOString().split("T")[0]}T${booking.time}`
    );

    const hoursBeforeSession =
      (sessionStart - new Date()) / (1000 * 60 * 60);

    let refundPercentage = 0;

    // 🔥 MENTOR CANCELS → FULL REFUND
    if (req.user.role === "mentor") {
      refundPercentage = 100;
      booking.cancelledBy = "mentor";
    }

    // 🔥 CANDIDATE CANCELS
    if (req.user.role === "candidate") {
      booking.cancelledBy = "candidate";

      if (hoursBeforeSession >= 24) {
        refundPercentage = 100;
      } else if (hoursBeforeSession >= 1) {
        refundPercentage = 50;
      } else {
        refundPercentage = 0;
      }
    }

    // 💰 Calculate refund
const amount = booking.amount || 0;
const refundAmount = (amount * refundPercentage) / 100;

booking.status = "cancelled";
booking.refundAmount = refundAmount;

if (refundPercentage > 0) {
  booking.paymentStatus = "refunded";
}


    await booking.save();

    res.json({
      success: true,
      refundPercentage,
      refundAmount,
      message:
        refundPercentage > 0
          ? `Refund of ${refundPercentage}% initiated`
          : "No refund as per cancellation policy"
    });

  } catch (error) {
    next(error);
  }
};


/**
 * =========================
 * AUTO-CLOSE SESSIONS (CRON)
 * =========================
 */
exports.autoCloseSessions = async () => {
  const now = new Date();

  const bookings = await Booking.find({
    status: "in-progress"
  });

  for (const booking of bookings) {

    const start = new Date(
      `${booking.date.toISOString().split("T")[0]}T${booking.time}`
    );

    const end = new Date(start.getTime() + booking.duration * 60000);

    if (now > end) {

      const mentorJoined = booking.attendance?.mentorJoinedAt;
      const candidateJoined = booking.attendance?.candidateJoinedAt;

      /* =========================
         BOTH JOINED → SUCCESS
      ========================= */
      if (mentorJoined && candidateJoined) {

        booking.status = "completed";

        if (booking.sessionType === "paid") {
          booking.paymentStatus = "paid";
        } else {
          booking.paymentStatus = "not-required";
        }
      }

      /* =========================
         MENTOR NO-SHOW
         → FULL REFUND
      ========================= */
      else if (!mentorJoined && candidateJoined) {

        booking.status = "cancelled";

        if (booking.sessionType === "paid") {
          booking.paymentStatus = "refunded";
booking.refundAmount = booking.amount;
        }
      }

      /* =========================
         CANDIDATE NO-SHOW
         → NO REFUND
      ========================= */
      else if (mentorJoined && !candidateJoined) {

        booking.status = "cancelled";

        if (booking.sessionType === "paid") {
          booking.paymentStatus = "paid"; // mentor keeps payment
          booking.refundAmount = 0;
        }
      }

      /* =========================
         BOTH DID NOT JOIN
         → NO REFUND
      ========================= */
      else {

        booking.status = "cancelled";

        if (booking.sessionType === "paid") {
          booking.paymentStatus = "paid";
          booking.refundAmount = 0;
        }
      }

      await booking.save();
    }
  }
};

/* =========================
   HELPER
   ========================= */
function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

module.exports = {
  createBooking: exports.createBooking,
  updateBookingStatus: exports.updateBookingStatus,
  joinSession: exports.joinSession,
  autoCloseSessions: exports.autoCloseSessions
};
