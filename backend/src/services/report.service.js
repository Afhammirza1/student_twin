const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { findStudentByUserId } = require("../models/student.model");
const { generateAIResponse } = require("./ai.service");

async function getWeeklyReport(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  const skills = await getSkillsByStudentId(student.id);

  if (skills.length === 0) {
    return { message: "No data available" };
  }

  let strong = [], medium = [], weak = [];

  for (let s of skills) {
    if (s.score >= 70) strong.push(s.skill_name);
    else if (s.score >= 40) medium.push(s.skill_name);
    else weak.push(s.skill_name);
  }

  let summary = [];

  if (strong.length > 0) {
    summary.push("You are strong in some skills — keep improving.");
  }

  if (weak.length > 0) {
    summary.push("Focus on weak skills to improve overall performance.");
  }

  if (medium.length > strong.length) {
    summary.push("You are progressing, but need consistency to level up.");
  }

  return {
    totalSkills: skills.length,
    strong,
    medium,
    weak,
    summary,
  };
}

// AI-enhanced weekly report
async function getWeeklyReportAI(userId) {
  const report = await getWeeklyReport(userId);

  if (report.message === "No data available") {
    return report;
  }

  const prompt = `
Student has:
- ${report.strong.join(", ")} (${report.strong.length} strong skill(s))
- ${report.medium.join(", ")} (${report.medium.length} medium skill(s))
- ${report.weak.join(", ")} (${report.weak.length} weak skill(s))
- Total skills: ${report.totalSkills}

Generate a short, personalized improvement report in 3-4 bullet points.
Be encouraging but honest. Keep it practical.
`;

  const raw = await generateAIResponse(prompt);
  const aiInsight = raw
    ? raw.split("\n").filter((line) => line.trim() !== "")
    : null;

  return {
    ...report,
    aiInsight,
  };
}

module.exports = { getWeeklyReport, getWeeklyReportAI };
