const Razorpay = require("razorpay");

let razorpay = null;

try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && !keyId.startsWith("your_")) {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log("✅ Razorpay initialized");
  } else {
    console.log("⚠️ Razorpay keys not configured — payment features disabled");
  }
} catch (err) {
  console.error("❌ Razorpay init failed:", err.message);
}

module.exports = razorpay;