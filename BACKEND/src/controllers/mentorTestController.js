const Mentor = require("../models/Mentor");
const generateMentorTest = require("../services/geminiTest.service");
const { MAX_TEST_ATTEMPTS, COOLDOWN_HOURS } = require("../config/constants");
const MentorTestSession = require("../models/MentorTestSession");

const fallbackTest = {
  mcq: [
    { id: 'q1', question: "What is a closure in JavaScript?", options: ["A function with access to its outer scope", "A closed function", "A loop construct", "A data type"], correctIndex: 0 },
    { id: 'q2', question: "What does REST stand for?", options: ["Representational State Transfer", "Remote State Transfer", "Representational Server Transfer", "Remote Server Transfer"], correctIndex: 0 },
    { id: 'q3', question: "Which of the following is a NoSQL database?", options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"], correctIndex: 0 },
    { id: 'q4', question: "What is the purpose of Git?", options: ["Version control", "Package management", "Code compilation", "Database management"], correctIndex: 0 },
    { id: 'q5', question: "What is React?", options: ["A UI library", "A database", "A programming language", "An operating system"], correctIndex: 0 },
  ]
};

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

    let test;
    try {
      test = await generateMentorTest(mentor.skills);
    } catch (geminiErr) {
      console.warn("Gemini test generation failed, using fallback:", geminiErr.message);
      test = fallbackTest;
    }

    await MentorTestSession.findOneAndUpdate(
      { mentorId: mentor._id },
      { test },
      { upsert: true }
    );

    const safeMCQ = test.mcq.map(({ correctIndex, ...q }) => q);

    res.status(200).json({
      success: true,
      test: {
        mcq: safeMCQ,
        timeLimit: 600
      }
    });
  } catch (error) {
    next(error);
  }
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

    const { mcqAnswers } = req.body;
    const storedTest = session.test;

    let correct = 0;
    storedTest.mcq.forEach(q => {
      const ans = mcqAnswers.find(a => a.id === q.id);
      if (ans && ans.answer === q.correctIndex) {
        correct++;
      }
    });

    const finalScore = (correct / storedTest.mcq.length) * 100;

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

    await MentorTestSession.deleteOne({ mentorId: mentor._id });

    res.status(200).json({
      success: true,
      verified: mentor.verified,
      score: Math.round(finalScore),
      attempts: mentor.verification.attempts,
      message: mentor.verified
        ? "Mentor verified successfully"
        : "Test failed. You can retry later."
    });
  } catch (error) {
    next(error);
  }
};
