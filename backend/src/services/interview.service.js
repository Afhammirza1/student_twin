const { generateAIResponse } = require("./ai.service");

/**
 * Generate an interview question based on skill set and conversation history
 */
async function getInterviewQuestion(skills, history = [], questionNumber = 1) {
  const skillList = skills.length > 0
    ? skills.map(s => `${s.skill_name || s.name} (score: ${s.score})`).join(", ")
    : "general software development";

  const historyText = history.length > 0
    ? history.map(m => `${m.role === "interviewer" ? "Interviewer" : "Candidate"}: ${m.content}`).join("\n")
    : "";

  const prompt = `You are a senior technical interviewer conducting a mock interview.
The candidate's skills: ${skillList}

${historyText ? `Conversation so far:\n${historyText}\n` : ""}
${questionNumber === 1
  ? "Start the interview with a warm, professional greeting and then ask your first technical question about one of their skills."
  : `Ask question ${questionNumber} of 5. Build on the conversation naturally. Ask about a different skill or go deeper.`}

RULES:
- Be professional but conversational
- Keep the question concise (2-3 sentences max)
- Ask ONE question at a time
- Do NOT provide answers or hints
- If this is question 5, mention it's the last question`;

  const response = await generateAIResponse(prompt);
  return response || "Tell me about a challenging project you've worked on recently.";
}

/**
 * Evaluate a candidate's answer and provide feedback
 */
async function evaluateAnswer(question, answer, skills) {
  const prompt = `You are a senior technical interviewer evaluating a candidate's answer.

Question asked: "${question}"
Candidate's answer: "${answer}"

Evaluate the answer on these criteria:
1. Technical accuracy (is it correct?)
2. Depth (did they explain properly?)
3. Communication (was it clear?)

Respond in this EXACT JSON format (no markdown, no extra text):
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence constructive feedback>",
  "strength": "<one thing they did well>",
  "improvement": "<one specific thing to improve>"
}`;

  const raw = await generateAIResponse(prompt);
  if (!raw) {
    return { score: 7, feedback: "Good answer! Keep practicing.", strength: "Clear communication", improvement: "Add more technical depth" };
  }

  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return { score: 7, feedback: raw.slice(0, 200), strength: "Engaged with the question", improvement: "Structure your answer more clearly" };
  }
}

/**
 * Generate the final interview summary and overall score
 */
async function generateInterviewSummary(history, evaluations) {
  const avgScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((sum, e) => sum + (e.score || 7), 0) / evaluations.length * 10)
    : 70;

  const prompt = `You are a senior technical interviewer. You just completed a 5-question mock interview.

Evaluation scores: ${evaluations.map((e, i) => `Q${i + 1}: ${e.score}/10`).join(", ")}
Average score: ${avgScore / 10}/10

Write a short (3-4 sentence) interview summary covering:
- Overall performance
- Main strengths observed
- Key areas to improve before a real interview

Be honest but encouraging. No bullet points, just a flowing paragraph.`;

  const summary = await generateAIResponse(prompt);
  
  let grade = "Developing";
  let gradeColor = "text-yellow-600";
  if (avgScore >= 80) { grade = "Strong Candidate"; gradeColor = "text-emerald-600"; }
  else if (avgScore >= 65) { grade = "Good Candidate"; gradeColor = "text-blue-600"; }
  else if (avgScore < 50) { grade = "Needs Improvement"; gradeColor = "text-red-600"; }

  return {
    avgScore,
    grade,
    gradeColor,
    summary: summary || "You completed the mock interview. Keep practicing to improve your technical communication.",
    evaluations,
  };
}

module.exports = { getInterviewQuestion, evaluateAnswer, generateInterviewSummary };
