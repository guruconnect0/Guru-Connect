const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment
} = require("../controllers/payment.controller");

const { protect, candidateOnly } =
  require("../middlewares/authMiddleware");

// Create Razorpay order
router.post(
  "/order/:bookingId",
  protect,
  candidateOnly,
  createOrder
);

// Verify payment
router.post(
  "/verify",
  protect,
  candidateOnly,
  verifyPayment
);

module.exports = router;