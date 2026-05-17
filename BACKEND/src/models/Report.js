const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reportedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    reason: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
