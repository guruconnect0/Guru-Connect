const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }
};
exports.mentorOnly = (req, res, next) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Mentor only"
    });
  }
  next();
};

exports.candidateOnly = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Candidate only"
    });
  }
  next();
};
