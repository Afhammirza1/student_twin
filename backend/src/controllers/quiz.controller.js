const { generateQuiz, scoreQuiz } = require("../services/quiz.service");
const { success, error } = require("../utils/response");

// POST /api/quiz/generate  { skill, level }
async function generate(req, res) {
  try {
    const { skill, level } = req.body;
    if (!skill) return error(res, "skill is required");

    const questions = await generateQuiz(skill, level || "intermediate");

    // Strip answers before sending to client — keep them only in session store
    const clientQuestions = questions.map(({ id, question, options }) => ({
      id, question, options,
    }));

    // Store full questions with answers in session for scoring
    // We send back a token (base64 encoded for stateless setup)
    const token = Buffer.from(JSON.stringify(questions)).toString("base64");

    return success(res, { questions: clientQuestions, token }, "Quiz generated");
  } catch (err) {
    return error(res, err.message);
  }
}

// POST /api/quiz/submit  { token, answers: { 1: "A", 2: "B", ... } }
async function submit(req, res) {
  try {
    const userId = req.user.userId;
    const { token, answers } = req.body;

    if (!token || !answers) return error(res, "token and answers are required");

    // Decode questions (with answers) from token
    let questions;
    try {
      questions = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    } catch {
      return error(res, "Invalid quiz token");
    }

    const result = await scoreQuiz(userId, questions, answers);
    return success(res, result, "Quiz scored");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { generate, submit };
