const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor"
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },

    type: {
      type: String,
      enum: ["credit", "debit", "refund"],
      required: true
    },

    amount: Number,

    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);