const { generateAIResponse } = require("./ai.service");
const { findStudentByUserId } = require("../models/student.model");
const { notify } = require("./notification.service");
const { addXP } = require("../models/student.model");

/**
 * Generate 5 MCQ questions for a given skill using AI.
 * Returns structured array of { question, options: [A,B,C,D], answer }
 */
async function generateQuiz(skill, level = "intermediate") {
  const prompt = `You are a strict technical quiz generator.
Generate exactly 5 multiple-choice questions to test a student's knowledge of "${skill}" at "${level}" level.

IMPORTANT: Respond with ONLY valid JSON. No explanation, no markdown, no code blocks.
Format:
[
  {
    "question": "Question text here?",
    "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
    "answer": "A"
  }
]

Rules:
- Each question must have exactly 4 options labeled A, B, C, D
- The "answer" field must be just the letter: A, B, C, or D
- Questions must be practical, not theoretical trivia
- Difficulty should match the "${level}" level
- Do NOT include any text outside the JSON array`;

  const raw = await generateAIResponse(prompt);
  if (!raw) throw new Error("AI failed to generate quiz. Please try again.");

  // Strip any markdown fences if AI wrapped it
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();

  let questions;
  try {
    questions = JSON.parse(cleaned);
  } catch {
    // Try to extract JSON array from the response
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("AI returned invalid quiz format. Please try again.");
    questions = JSON.parse(match[0]);
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Quiz generation failed — no questions returned.");
  }

  // Validate structure, strip answers before sending to client
  return questions.map((q, i) => ({
    id: i + 1,
    question: q.question,
    options: q.options,
    answer: q.answer?.toUpperCase().trim(),  // stored server-side only
  }));
}

/**
 * Score a submitted quiz and return XP reward.
 * answers: { 1: "A", 2: "C", ... }
 * questions: the array from generateQuiz (with answers)
 */
async function scoreQuiz(userId, questions, answers) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  let correct = 0;
  const results = questions.map((q) => {
    const submitted = (answers[q.id] || "").toUpperCase().trim();
    const isCorrect = submitted === q.answer;
    if (isCorrect) correct++;
    return {
      id: q.id,
      question: q.question,
      yourAnswer: submitted,
      correctAnswer: q.answer,
      isCorrect,
    };
  });

  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);

  // XP: 5 per correct answer, bonus 10 XP for perfect score
  const xpEarned = correct * 5 + (percentage === 100 ? 10 : 0);

  if (xpEarned > 0) {
    await addXP(userId, xpEarned);
    try {
      await notify(
        userId,
        "badge",
        `Quiz Complete! ${percentage >= 80 ? "🏆" : "📝"}`,
        `You scored ${correct}/${total} (${percentage}%) and earned ${xpEarned} XP!`
      );
    } catch (notifyErr) {
      console.warn("Quiz notify failed (non-critical):", notifyErr.message);
    }
  }

  return {
    correct,
    total,
    percentage,
    xpEarned,
    grade: percentage >= 80 ? "STRONG" : percentage >= 50 ? "MEDIUM" : "WEAK",
    results,
  };
}

module.exports = { generateQuiz, scoreQuiz };
