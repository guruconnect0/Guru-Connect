const Booking = require("../models/booking");

/**
 * =========================
 * INITIATE PAYMENT (MOCK)
 * =========================
 */
exports.createPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking || booking.sessionType !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Invalid paid booking"
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed"
      });
    }

    // Mock payment success
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    res.json({
      success: true,
      message: "Payment successful (mock)",
      booking
    });

  } catch (error) {
    next(error);
  }
};
