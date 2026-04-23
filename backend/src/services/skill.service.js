const { addStudentSkill, updateStudentSkill, findSkill, getSkillsByStudentId } = require("../models/studentSkill.model");
const { findStudentByUserId, addXP } = require("../models/student.model");
const { calculateScore } = require("../utils/scoreCalculator");
const { saveScore } = require("../models/scoreHistory.model");
const { notify } = require("./notification.service");

async function createSkill(data, userId) {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw new Error("Student not found");
  }

  const result = calculateScore(data);

  // Check for existing skill (prevent duplicates)
  const existing = await findSkill(student.id, data.skillName);

  let skill;

  if (existing) {
    // Update instead of insert
    skill = await updateStudentSkill(existing.id, {
      level: data.level,
      projects: data.projects,
      certifications: data.certifications,
      score: result.total,
    });
  } else {
    skill = await addStudentSkill({
      studentId: student.id,
      skillName: data.skillName,
      level: data.level,
      projects: data.projects,
      certifications: data.certifications,
      score: result.total,
    });
  }

  // 🔥 Save AVERAGE score snapshot for progress tracking
  // Fetch all skills after update to compute current average
  const allSkills = await getSkillsByStudentId(student.id);
  const avgScore = allSkills.length > 0
    ? Math.round(allSkills.reduce((sum, s) => sum + s.score, 0) / allSkills.length)
    : result.total;
  await saveScore(student.id, avgScore);

  // 🏆 Award XP if new skill and notify
  let xpAwarded = 0;
  if (!existing) {
    await addXP(userId, 10);
    xpAwarded = 10;
    await notify(
      userId,
      "badge",
      `New Skill Added! 🚀`,
      `${data.skillName} has been added to your profile. Your average skill score is now ${avgScore}/100.`
    );
  } else {
    await notify(
      userId,
      "xp",
      `Skill Updated 📈`,
      `${data.skillName} updated — new score: ${result.total}/100. Keep leveling up!`
    );
  }

  return {
    ...skill,
    breakdown: result.breakdown,
    updated: !!existing,
    xpAwarded,
  };
}

module.exports = { createSkill };
