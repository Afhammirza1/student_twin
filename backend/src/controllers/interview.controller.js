const { getInterviewQuestion, evaluateAnswer, generateInterviewSummary } = require("../services/interview.service");
const { findStudentByUserId } = require("../models/student.model");
const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { addXP } = require("../models/student.model");
const { notify } = require("../services/notification.service");
const { success, error } = require("../utils/response");

// POST /api/interview/start
// Returns the first question and a session token
async function start(req, res) {
  try {
    const userId = req.user.userId;
    const student = await findStudentByUserId(userId);
    if (!student) return error(res, "Student not found");

    const skills = await getSkillsByStudentId(student.id);
    const firstQuestion = await getInterviewQuestion(skills, [], 1);

    // Session token: encodes skills + history for stateless operation
    const sessionData = {
      skills: skills.map(s => ({ skill_name: s.skill_name, score: s.score })),
      history: [{ role: "interviewer", content: firstQuestion }],
      questionNumber: 1,
      evaluations: [],
    };
    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    return success(res, { question: firstQuestion, token, questionNumber: 1 }, "Interview started");
  } catch (err) {
    return error(res, err.message);
  }
}

// POST /api/interview/answer  { token, answer }
async function answer(req, res) {
  try {
    const userId = req.user.userId;
    const { token, answer: userAnswer } = req.body;
    if (!token || !userAnswer) return error(res, "token and answer are required");

    let sessionData;
    try {
      sessionData = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    } catch {
      return error(res, "Invalid session token");
    }

    const { skills, history, questionNumber, evaluations } = sessionData;
    const lastQuestion = history[history.length - 1]?.content || "";

    // Evaluate the answer
    const evaluation = await evaluateAnswer(lastQuestion, userAnswer, skills);

    // Add answer to history
    const newHistory = [
      ...history,
      { role: "candidate", content: userAnswer },
    ];
    const newEvaluations = [...evaluations, evaluation];

    // Check if interview is complete (5 questions)
    if (questionNumber >= 5) {
      // Generate final summary
      const summary = await generateInterviewSummary(newHistory, newEvaluations);

      // Award XP based on performance
      const xpEarned = Math.round(summary.avgScore / 5); // max 20 XP
      if (xpEarned > 0) {
        await addXP(userId, xpEarned);
        await notify(
          userId,
          "badge",
          `Mock Interview Complete! 🎤`,
          `You scored ${summary.avgScore}% overall and earned ${xpEarned} XP. Grade: ${summary.grade}`
        );
      }

      const newToken = Buffer.from(JSON.stringify({ ...sessionData, history: newHistory, evaluations: newEvaluations, questionNumber: 6 })).toString("base64");

      return success(res, {
        done: true,
        evaluation,
        summary,
        xpEarned,
        token: newToken,
      }, "Interview complete");
    }

    // Ask next question
    const nextQuestionNumber = questionNumber + 1;
    const nextQuestion = await getInterviewQuestion(skills, newHistory, nextQuestionNumber);

    const updatedSession = {
      skills,
      history: [...newHistory, { role: "interviewer", content: nextQuestion }],
      questionNumber: nextQuestionNumber,
      evaluations: newEvaluations,
    };
    const newToken = Buffer.from(JSON.stringify(updatedSession)).toString("base64");

    return success(res, {
      done: false,
      evaluation,
      question: nextQuestion,
      questionNumber: nextQuestionNumber,
      token: newToken,
    }, "Answer received");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { start, answer };
