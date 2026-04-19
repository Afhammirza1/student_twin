const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { findStudentByUserId } = require("../models/student.model");
const { generateAIResponse } = require("./ai.service");

async function getRecommendations(userId, useAI = false) {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw new Error("Student not found");
  }

  const skills = await getSkillsByStudentId(student.id);

  let recommendations = [];

  // 🔹 Rule-based recommendations
  for (let s of skills) {
    if (s.score < 40) {
      recommendations.push({
        skill: s.skill_name,
        level: "WEAK",
        score: s.score,
        message: `Improve ${s.skill_name} — your score is low`,
        action: "Build 2 projects + complete 1 certification",
      });
    } else if (s.score < 70) {
      recommendations.push({
        skill: s.skill_name,
        level: "MEDIUM",
        score: s.score,
        message: `Strengthen ${s.skill_name} with more practice`,
        action: "Take on 1 real-world project + earn an advanced certification",
      });
    }
  }

  // 🔥 Top 3 Priorities — sorted weakest first
  const topPriorities = skills
    .filter((s) => s.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => s.skill_name);

  // 🔥 Actionable Next Step
  const weakSkills = skills
    .filter((s) => s.score < 50)
    .sort((a, b) => a.score - b.score);

  const nextStep =
    weakSkills.length > 0
      ? `Work on ${weakSkills[0].skill_name} today for 1 hour`
      : skills.length > 0
      ? "Keep practicing your current skills"
      : "Start by adding your first skill";

  // Career alignment
  const hasJava = skills.some(
    (s) => s.skill_name.toLowerCase() === "java" && s.score >= 60
  );
  const hasSQL = skills.some(
    (s) => s.skill_name.toLowerCase() === "sql" && s.score >= 60
  );

  if (!hasJava || !hasSQL) {
    recommendations.push({
      skill: "Career Path",
      level: "INFO",
      score: null,
      message: "Focus on Backend Development skills like Java and SQL",
      action: "Prioritize Java and SQL to unlock Backend Developer roles",
    });
  } else {
    recommendations.push({
      skill: "Career Path",
      level: "SUCCESS",
      score: null,
      message: "You are on track for Backend Developer roles",
      action: "Keep building projects and contributing to open source",
    });
  }

  if (skills.length === 0) {
    recommendations.push({
      skill: "Getting Started",
      level: "INFO",
      score: null,
      message: "Start by adding your skills to get personalized suggestions",
      action: "Add at least 3 skills to see meaningful recommendations",
    });
  }

  // 🔥 AI enhancement
  let aiSuggestions = null;
  if (useAI && skills.length > 0) {
    const prompt = `
Student skills:
${skills.map((s) => `${s.skill_name}: score ${s.score}`).join(", ")}

Suggest personalized improvement tips in 3-4 bullet points.
Be specific and actionable.
`;

    const raw = await generateAIResponse(prompt);
    if (raw) {
      aiSuggestions = raw.split("\n").filter((line) => line.trim() !== "");
    }
  }

  return {
    recommendations,
    topPriorities,
    nextStep,
    aiSuggestions,
  };
}

module.exports = { getRecommendations };
