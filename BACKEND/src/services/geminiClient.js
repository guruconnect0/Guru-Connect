// Smart AI client: uses Gemini API if key is available, falls back to Ollama

let model;

if (process.env.GEMINI_API_KEY) {
  // ✅ Use Google Gemini API
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  console.log("🤖 AI Client: Using Google Gemini API");
} else {
  // ⚠️ Fallback to local Ollama
  const OLLAMA_URL = "http://localhost:11434/api/generate";
  const MODEL = "mistral";

  model = {
    generateContent: async (prompt) => {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          prompt: prompt,
          stream: false
        })
      });

      const data = await res.json();

      return {
        response: {
          text: () => data.response
        }
      };
    }
  };
  console.log("🤖 AI Client: Using local Ollama (no GEMINI_API_KEY found)");
}

module.exports = model;
