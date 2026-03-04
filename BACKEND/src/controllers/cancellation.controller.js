const Booking = require("../models/booking");
const razorpay = require("../config/razorpay");

exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ success: false });

    if (booking.paymentStatus === "refunded")
      return res.status(400).json({
        success: false,
        message: "Already refunded"
      });

    const now = new Date();
    const sessionStart = new Date(
      `${booking.date.toISOString().split("T")[0]}T${booking.time}`
    );

    const hoursLeft =
      (sessionStart - now) / (1000 * 60 * 60);

    let refundAmount = 0;

    if (req.user.role === "candidate") {
      if (booking.sessionType === "paid" &&
          booking.paymentStatus === "paid") {

        if (hoursLeft >= 24)
          refundAmount = booking.amount;
        else if (hoursLeft >= 1)
          refundAmount = booking.amount * 0.5;
        else
          refundAmount = 0;

        if (refundAmount > 0 && booking.razorpayPaymentId) {
          await razorpay.payments.refund(
            booking.razorpayPaymentId,
            { amount: Math.round(refundAmount * 100) }
          );
          booking.paymentStatus = "refunded";
        }
      }

      booking.status = "cancelled";
      await booking.save();

      return res.json({
        success: true,
        refundAmount
      });
    }

    if (req.user.role === "mentor") {
      if (booking.sessionType === "paid" &&
          booking.paymentStatus === "paid") {

        refundAmount = booking.amount;

        await razorpay.payments.refund(
          booking.razorpayPaymentId,
          { amount: Math.round(refundAmount * 100) }
        );

        booking.paymentStatus = "refunded";
      }

      booking.status = "cancelled";
      await booking.save();

      return res.json({
        success: true,
        refundAmount
      });
    }

    res.status(403).json({ success: false });

  } catch (err) {
    next(err);
  }
};