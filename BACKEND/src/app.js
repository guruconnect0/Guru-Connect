const express = require("express");
const cors = require("cors");

const app = express();

// --------------------
// Global Middlewares
// --------------------
app.use(cors({
  origin: true, // Allow all origins for dev, or specify frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --------------------
// Health Check
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mentor Connect Backend is running 🚀"
  });
});

// --------------------
// Routes
// --------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/candidate", require("./routes/candidate.routes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/booking", require("./routes/booking.routes"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/review", require("./routes/review.routes"));
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// --------------------
// Global Error Handler (LAST)
// --------------------
app.use(require("./middlewares/error.middleware"));

module.exports = app;
