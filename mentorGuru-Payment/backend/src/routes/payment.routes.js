const express = require("express");
const router = express.Router();

const {
  createPayment
} = require("../controllers/payment.controller");

const {
  protect,
  candidateOnly
} = require("../middlewares/authMiddleware");

/* =========================
   PAYMENTS
   ========================= */

// Candidate pays for paid session
router.post(
  "/:bookingId/pay",
  protect,
  candidateOnly,
  createPayment
);

module.exports = router;
