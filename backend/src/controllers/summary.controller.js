const { getAnalytics } = require("../services/analytics.service");
const { getConsistency } = require("../services/consistency.service");
const { success, error } = require("../utils/response");
const { findStudentByUserId, updateAiSummary } = require("../models/student.model");
const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { generateAIResponse } = require("../services/ai.service");
const { calculateBadges } = require("../services/badge.service");

async function getSummary(req, res) {
  try {
    const userId = req.user.userId;

    const analytics = await getAnalytics(userId);
    const consistency = await getConsistency(userId);
    const student = await findStudentByUserId(userId);

    const weakSkills = Object.entries(analytics.skillLevels)
      .filter(([_, v]) => v.level === "WEAK")
      .map(([k]) => k);

    const summary = {
      userId: student.user_id,
      totalScore: analytics.totalScore,
      averageScore: analytics.averageScore,
      readiness: Math.round(analytics.averageScore || 0),
      skillCount: analytics.skillCount,
      consistency: consistency.consistency,
      xp: student.xp || 0,
      streak: student.streak || 0,
      weakSkills,
      badges: calculateBadges({ streak: student.streak || 0, xp: student.xp || 0, github_username: student.github_username }, await getSkillsByStudentId(student.id)),
      nextAction:
        weakSkills.length > 0
          ? `Focus on ${weakSkills[0]}`
          : "Keep improving your strong skills",
    };

    return success(res, summary, "Summary fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

async function generateAiProfile(req, res) {
  try {
    const userId = req.user.userId;
    const student = await findStudentByUserId(userId);
    if (!student) return error(res, "Student not found");

    const skills = await getSkillsByStudentId(student.id);
    const skillNames = skills.map(s => s.skill_name).join(", ");

    const prompt = `
Student Skills:
${skillNames}

Generate a short professional summary for portfolio. Max 3-4 sentences. Be encouraging. Wait, assume the persona of a backend-focused professional output.
`;

    const raw = await generateAIResponse(prompt);
    if (!raw) return error(res, "Failed to generate AI Profile");
    await updateAiSummary(student.id, raw);

    return success(res, { aiSummary: raw }, "AI Profile Generated successfully");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getSummary, generateAiProfile };
