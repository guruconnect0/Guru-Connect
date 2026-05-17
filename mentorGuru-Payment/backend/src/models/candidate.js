const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    interests: {
      type: [String],
      default: []
    },

    goals: {
      type: String
    },

    education: {
      type: String
    },

    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"]
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  },
  { timestamps: true }
);

// Geo index
candidateSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Candidate", candidateSchema);
