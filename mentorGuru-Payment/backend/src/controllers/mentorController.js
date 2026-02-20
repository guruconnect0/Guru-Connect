const Mentor = require("../models/Mentor");

// CREATE MENTOR PROFILE
exports.createMentorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if profile already exists
    const existingProfile = await Mentor.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Mentor profile already exists"
      });
    }

    const mentor = await Mentor.create({
      userId,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: "Mentor profile created successfully",
      mentor
    });
  } catch (error) {
    next(error);
  }
};
exports.getMentorProfile = async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
      .populate("userId", "name email");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      mentor
    });
  } catch (error) {
    next(error);
  }
};
exports.searchMentors = async (req, res, next) => {
  try {
    const { lat, lng, skill, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const query = {     
verified:true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000 // km → meters
        }
      }
    };

    // Optional filters
    if (skill) {
      query.skills = { $in: [skill] };
    }

    const mentors = await Mentor.find(query)
      .populate("userId", "name email")
      .select("-__v");

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    next(error);
  }
};
