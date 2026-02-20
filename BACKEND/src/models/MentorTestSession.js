const mongoose = require("mongoose");

const mentorTestSessionSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
      unique: true
    },

    test: {
      type: Object,
      required: true
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1800 // 🔥 auto-delete after 30 minutes
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model(
  "MentorTestSession",
  mentorTestSessionSchema
);
