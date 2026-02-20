const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ✅ USE STABLE MODEL ONLY
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

module.exports = model;
