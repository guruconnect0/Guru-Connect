const express = require("express");
const router = express.Router();
const {
  register,
  login
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const Notification = require("../models/Notification");
const Report = require("../models/Report");

router.post("/register", register);
router.post("/login", login);

// Fetch system broadcasts and personal alerts for logged-in user
router.get("/notifications", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: req.user._id }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Help Center: Submit support ticket / complaint to admin
router.post("/tickets", protect, async (req, res) => {
  try {
    const { reason, description, priority, reportedId, bookingId } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: "Reason is required" });
    }
    const ticket = await Report.create({
      reporterId: req.user._id,
      reportedId: reportedId || null,
      bookingId: bookingId || null,
      reason,
      description: description || "",
      priority: priority || "medium",
      status: "pending"
    });
    res.status(201).json({ success: true, message: "Ticket submitted successfully", ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Help Center: Get logged-in user's submitted tickets
router.get("/tickets", protect, async (req, res) => {
  try {
    const tickets = await Report.find({ reporterId: req.user._id })
      .populate("reportedId", "name email")
      .populate("bookingId")
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
