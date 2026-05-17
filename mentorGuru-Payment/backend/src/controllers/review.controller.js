const Review = require("../models/review");
const Booking = require("../models/booking");
const Mentor = require("../models/Mentor");

exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const candidateId = req.user._id;

    // 1️⃣ Booking must exist
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // 2️⃣ Only booking candidate can review
    if (booking.candidateId.toString() !== candidateId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // 3️⃣ Only completed sessions
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed sessions"
      });
    }

    // 4️⃣ Prevent duplicate review
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted"
      });
    }

    // 5️⃣ Create review
    const review = await Review.create({
      bookingId,
      mentorId: booking.mentorId,
      candidateId,
      rating,
      comment
    });

    // 6️⃣ Update mentor rating
    const mentor = await Mentor.findById(booking.mentorId);

    const totalReviews = mentor.totalReviews + 1;
    const newAverage =
      (mentor.averageRating * mentor.totalReviews + rating) / totalReviews;

    mentor.totalReviews = totalReviews;
    mentor.averageRating = Number(newAverage.toFixed(2));

    await mentor.save();

    res.status(201).json({
      success: true,
      review
    });

  } catch (error) {
    next(error);
  }
};
