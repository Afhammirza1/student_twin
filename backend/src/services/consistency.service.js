const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { findStudentByUserId } = require("../models/student.model");

async function getConsistency(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  const skills = await getSkillsByStudentId(student.id);

  if (skills.length === 0) {
    return { consistency: 0, message: "No activity yet" };
  }

  // Get unique active days
  const activeDays = new Set(
    skills.map(s => new Date(s.created_at).toDateString())
  );

  const totalDays = 7; // last week

  const consistency = (activeDays.size / totalDays) * 100;

  return {
    consistency: Math.round(consistency),
    activeDays: activeDays.size,
    totalDays
  };
}

module.exports = { getConsistency };
