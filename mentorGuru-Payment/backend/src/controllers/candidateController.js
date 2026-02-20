const Candidate = require("../models/candidate");

// CREATE candidate profile
exports.createCandidateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if profile already exists
    const existingProfile = await Candidate.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Candidate profile already exists"
      });
    }

    const candidate = await Candidate.create({
      userId,
      ...req.body
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
