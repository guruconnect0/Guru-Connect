
const model = require("./geminiClient");

const generateMentorTest = async (skills) => {
  const prompt = `
You are a strict technical interviewer.

Generate a mentor verification test based on these skills:
${skills.join(", ")}

Rules:
- 5 MCQ questions
- Each MCQ must have 4 options
- Include correctIndex (0–3)
- 2 short answer questions
- Medium difficulty
- NO explanations
- Return ONLY valid JSON

JSON format:
{
  "mcq": [
    {
      "id": "q1",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0
    }
  ],
  "shortAnswer": [
    {
      "id": "s1",
      "question": "string"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean Gemini markdown if any
    const cleanJSON = response.replace(/```json|```/g, "").trim();


    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error("Gemini Test Generation Error:", error);
    throw new Error("Failed to generate mentor test");
  }
};

module.exports = generateMentorTest;
