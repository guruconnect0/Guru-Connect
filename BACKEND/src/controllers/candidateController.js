const Candidate = require("../models/candidate");
const User = require("../models/User");

// CREATE or UPDATE candidate profile
exports.createCandidateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, ...candidateData } = req.body;

    // Update User model if name is provided
    if (name) {
      await User.findByIdAndUpdate(userId, { name });
    }

    // Check if profile already exists
    const existingProfile = await Candidate.findOne({ userId });
    if (existingProfile) {
      // UPDATE existing profile
      Object.assign(existingProfile, candidateData);
      await existingProfile.save();

      return res.status(200).json({
        success: true,
        message: "Candidate profile updated successfully",
        candidate: existingProfile
      });
    }

    const candidate = await Candidate.create({
      userId,
      ...candidateData
    });

    res.status(201).json({
      success: true,
      message: "Candidate profile created successfully",
      candidate
    });
  } catch (error) {
    next(error);
  }
};

// GET candidate profile (with name & email)
exports.getCandidateProfile = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user._id })
      .populate("userId", "name email");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found"
      });
    }

    res.status(200).json({
      success: true,
      candidate
    });
  } catch (error) {
    next(error);
  }
};
