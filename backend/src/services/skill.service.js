const { addStudentSkill, updateStudentSkill, findSkill } = require("../models/studentSkill.model");
const { findStudentByUserId, addXP } = require("../models/student.model");
const { calculateScore } = require("../utils/scoreCalculator");
const { saveScore } = require("../models/scoreHistory.model");

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

  // 🔥 Save score snapshot for progress tracking
  await saveScore(student.id, result.total);

  // 🏆 Award XP if new skill
  let xpAwarded = 0;
  if (!existing) {
    const xpResult = await addXP(userId, 10);
    xpAwarded = 10;
  }

  return {
    ...skill,
    breakdown: result.breakdown,
    updated: !!existing,
    xpAwarded,
  };
}

module.exports = { createSkill };
