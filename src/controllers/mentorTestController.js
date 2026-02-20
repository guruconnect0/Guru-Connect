const Mentor = require("../models/Mentor");
const generateMentorTest = require("../services/geminiTest.service");
const { MAX_TEST_ATTEMPTS, COOLDOWN_HOURS } = require("../config/constants");
const MentorTestSession = require("../models/MentorTestSession");

const model = require("../services/geminiClient");

exports.getMentorTest = async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    if (mentor.verified) {
      return res.status(400).json({
        success: false,
        message: "Mentor already verified"
      });
    }

    if (mentor.verification.attempts >= MAX_TEST_ATTEMPTS) {
      return res.status(403).json({
        success: false,
        message: "Maximum test attempts exceeded"
      });
    }

    if (mentor.verification.lastAttemptAt) {
      const hoursPassed =
        (Date.now() - mentor.verification.lastAttemptAt.getTime()) /
        (1000 * 60 * 60);

      if (hoursPassed < COOLDOWN_HOURS) {
        return res.status(429).json({
          success: false,
          message: "Please wait before taking the test again"
        });
      }
    }

    // 🔥 Generate test
    const test = await generateMentorTest(mentor.skills);

    // 🔥 Save test session (overwrite if exists)
    await MentorTestSession.findOneAndUpdate(
      { mentorId: mentor._id },
      { test },
      { upsert: true }
    );

    // Remove correct answers before sending
    const safeMCQ = test.mcq.map(({ correctIndex, ...q }) => q);

    res.status(200).json({
      success: true,
      test: {
        mcq: safeMCQ,
        shortAnswer: test.shortAnswer,
        timeLimit: {
          mcq: 600,
          shortAnswer: 900
        }
      }
    });
  } catch (error) {
    next(error);
  }
};



const evaluateShortAnswers = async (questions, answers) => {
  const prompt = `
You are a strict technical evaluator.

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}

Rules:
- Score from 0 to 100
- Be strict but fair
- Return ONLY JSON

Format:
{
  "score": number,
  "feedback": "string"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleanJSON = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJSON);
};


exports.submitMentorTest = async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    const session = await MentorTestSession.findOne({
      mentorId: mentor._id
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Test session expired. Please retake the test."
      });
    }

    const { mcqAnswers, shortAnswers } = req.body;
    const storedTest = session.test;

    // ---- MCQ evaluation ----
    let correct = 0;
    storedTest.mcq.forEach(q => {
      const ans = mcqAnswers.find(a => a.id === q.id);
      if (ans && ans.answer === q.correctIndex) {
        correct++;
      }
    });

    const mcqScore =
      (correct / storedTest.mcq.length) * 100;

    // ---- Short answer (Gemini) ----
    const evaluation = await evaluateShortAnswers(
      storedTest.shortAnswer,
      shortAnswers
    );

    const shortScore = evaluation.score;

    const finalScore = mcqScore * 0.4 + shortScore * 0.6;

    mentor.verification.attempts += 1;
    mentor.verification.score = finalScore;
    mentor.verification.lastAttemptAt = new Date();

    if (finalScore >= 70) {
      mentor.verified = true;
      mentor.verification.passed = true;
    } else {
      mentor.verification.passed = false;
    }

    await mentor.save();

    // 🔥 Delete test session
    await MentorTestSession.deleteOne({ mentorId: mentor._id });

    res.status(200).json({
      success: true,
      verified: mentor.verified,
      score: Math.round(finalScore),
      message: mentor.verified
        ? "Mentor verified successfully 🎉"
        : "Test failed. You can retry later."
    });
  } catch (error) {
    next(error);
  }
};
