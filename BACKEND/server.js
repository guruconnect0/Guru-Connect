require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

const cron = require("node-cron");
const { autoCloseSessions } = require("./src/controllers/bookingController");

// Runs every 5 minutes
cron.schedule("* * * * *", async () => {
  try {
    console.log("⏱ Auto-closing sessions...");
    await autoCloseSessions();
    console.log("✅ Auto-close completed");
  } catch (error) {
    console.error("❌ Auto-close failed:", error.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
