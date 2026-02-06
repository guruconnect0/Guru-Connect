const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true
    },

    sessionType: {
      type: String,
      enum: ["demo", "paid"],
      default: "demo"
    },

    date: {
      type: Date,
      required: true
    },

    time: {
      type: String, // HH:mm (24h)
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    amount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["not-required", "pending", "paid", "refunded"],
      default: "not-required"
    },

    attendance: {
      mentorJoinedAt: Date,
      candidateJoinedAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
