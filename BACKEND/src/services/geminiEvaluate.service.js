const model = require("./geminiClient");

const evaluateShortAnswers = async (questions, answers) => {
  const prompt = `
You are evaluating a mentor's technical answers.

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}

Rules:
- Score from 0 to 100
- Be strict
- Consider correctness, clarity, depth
- Return ONLY JSON

Format:
{
  "score": number,
  "feedback": "short feedback"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleanJSON = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleanJSON);
};

module.exports = evaluateShortAnswers;
