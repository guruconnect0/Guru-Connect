const razorpay = require("../config/razorpay");
const Booking = require("../models/booking");
const crypto = require("crypto");

/* =========================
   CREATE ORDER
========================= */
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking || booking.sessionType !== "paid")
      return res.status(400).json({ success: false });

    if (booking.status !== "awaiting-payment")
      return res.status(400).json({
        success: false,
        message: "Mentor must accept first"
      });

    const order = await razorpay.orders.create({
      amount: booking.amount * 100,
      currency: "INR",
      receipt: booking._id.toString()
    });

    booking.razorpayOrderId = order.id;
    booking.paymentStatus = "pending";

    await booking.save();

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =========================
   VERIFY PAYMENT
========================= */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature)
      return res.status(400).json({ success: false });

    const booking = await Booking.findOne({
      razorpayOrderId: razorpay_order_id
    });

    if (!booking) return res.status(404).json({ success: false });

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.razorpayPaymentId = razorpay_payment_id;

    await booking.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};