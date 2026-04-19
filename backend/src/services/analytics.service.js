const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { findStudentByUserId } = require("../models/student.model");
const { getScoreHistory } = require("../models/scoreHistory.model");

async function getAnalytics(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw new Error("Student not found");
  }

  const skills = await getSkillsByStudentId(student.id);

  let totalScore = 0;
  const skillLevels = {};

  for (let s of skills) {
    totalScore += s.score;

    let level;
    let reason;

    if (s.score >= 70) {
      level = "STRONG";
      reason = "Strong performance with good projects";
    } else if (s.score >= 40) {
      level = "MEDIUM";
      reason = "Moderate experience but needs improvement";
    } else {
      level = "WEAK";
      reason = "Low project count and certifications";
    }

    skillLevels[s.skill_name] = {
      level,
      score: s.score,
      reason,
    };
  }

  const averageScore =
    skills.length === 0 ? 0 : totalScore / skills.length;

  return {
    totalScore,
    averageScore,
    skillCount: skills.length,
    skillLevels,
  };
}

// 🔥 Progress over time
async function getProgress(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw new Error("Student not found");
  }

  const history = await getScoreHistory(student.id);

  if (history.length === 0) {
    return { message: "No progress data yet", history: [] };
  }

  const firstScore = history[0].score;
  const latestScore = history[history.length - 1].score;
  const growth = latestScore - firstScore;

  return {
    history,
    totalEntries: history.length,
    firstScore,
    latestScore,
    growth,
    trend: growth > 0 ? "IMPROVING" : growth === 0 ? "STABLE" : "DECLINING",
  };
}

module.exports = { getAnalytics, getProgress };
