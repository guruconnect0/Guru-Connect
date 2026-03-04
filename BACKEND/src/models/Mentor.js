const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    skills: {
      type: [String],
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    bio: String,

    rating: {
      type: Number,
      default: 0
    },

    verified: {
      type: Boolean,
      default: false
    },

    // 🔥 ADD THIS BLOCK
    verification: {
      attempts: {
        type: Number,
        default: 0
      },
      score: {
        type: Number,
        default: 0
      },
      passed: {
        type: Boolean,
        default: false
      },
      lastAttemptAt: {
        type: Date
      }
    },

    hourlyRate: {
      type: Number,
      required: true
    },

    availability: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    averageRating: {
  type: Number,
  default: 0
},
totalReviews: {
  type: Number,
  default: 0
},
walletBalance: {
  type: Number,
  default: 0
},

totalEarnings: {
  type: Number,
  default: 0
},

totalWithdrawn: {
  type: Number,
  default: 0
},
payoutRequests: [
  {
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    requestedAt: Date
  }
],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  { timestamps: true }
);

mentorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Mentor", mentorSchema);
