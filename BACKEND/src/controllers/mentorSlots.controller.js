const Mentor = require("../models/Mentor");
const Booking = require("../models/booking");

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { mentorId } = req.params;
    const { date, sessionType = "demo" } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }

    const slotDuration = sessionType === "demo" ? 15 : 60;

    /* Generate all possible slots for the full day (00:00 - 23:59) */
    const slots = [];
    const dayEnd = 24 * 60; // 1440 minutes
    let start = 0;

    while (start + slotDuration <= dayEnd) {
      slots.push(formatMinutes(start));
      start += slotDuration;
    }

    /* Fetch existing bookings to exclude already-booked slots */
    const bookings = await Booking.find({
      mentorId,
      date: new Date(date),
      status: { $in: ["pending", "confirmed", "in-progress"] }
    });

    /* 4️⃣ Remove conflicting slots */
    const availableSlots = slots.filter(slot => {
      const slotStart = parseTime(slot);
      const slotEnd = slotStart + slotDuration;

      return !bookings.some(b => {
        const bookedStart = parseTime(b.time);
        const bookedEnd = bookedStart + b.duration;

        return slotStart < bookedEnd && slotEnd > bookedStart;
      });
    });

    res.json({
      success: true,
      date,
      sessionType,
      slots: availableSlots
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   HELPERS
   ========================= */

function parseTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function formatMinutes(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}
