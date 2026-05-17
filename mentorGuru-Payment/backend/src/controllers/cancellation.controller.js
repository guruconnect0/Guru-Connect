const Booking = require("../models/booking");

/**
 * =========================
 * CANCEL BOOKING
 * =========================
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const now = new Date();
    const sessionStart = new Date(
      `${booking.date.toISOString().split("T")[0]}T${booking.time}`
    );

    const hoursLeft =
      (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Candidate cancelling
    if (req.user.role === "candidate") {
      if (booking.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel completed session"
        });
      }

      // Refund logic
      if (booking.sessionType === "paid") {
        if (hoursLeft >= 24) {
          booking.paymentStatus = "refunded";
        } else {
          booking.paymentStatus = "paid"; // no refund
        }
      }

      booking.status = "cancelled";
      await booking.save();

      return res.json({
        success: true,
        message: "Booking cancelled by candidate",
        booking
      });
    }

    // Mentor cancelling → always refund
    if (req.user.role === "mentor") {
      booking.status = "cancelled";
      if (booking.sessionType === "paid") {
        booking.paymentStatus = "refunded";
      }
      await booking.save();

      return res.json({
        success: true,
        message: "Booking cancelled by mentor",
        booking
      });
    }

    res.status(403).json({
      success: false,
      message: "Unauthorized"
    });

  } catch (error) {
    next(error);
  }
};
