const pool = require("../config/db");

// Add skill
async function addStudentSkill(data) {
  const {
    studentId,
    skillName,
    level,
    projects,
    certifications,
    score,
  } = data;

  const result = await pool.query(
    `INSERT INTO student_skills 
    (student_id, skill_id, level, projects, certifications, score)
    VALUES ($1, 
      (SELECT id FROM skills WHERE name = $2),
      $3, $4, $5, $6)
    RETURNING *`,
    [studentId, skillName, level, projects, certifications, score]
  );

  return result.rows[0];
}

// Update existing skill
async function updateStudentSkill(id, data) {
  const { level, projects, certifications, score } = data;

  const result = await pool.query(
    `UPDATE student_skills 
     SET level = $1, projects = $2, certifications = $3, score = $4
     WHERE id = $5
     RETURNING *`,
    [level, projects, certifications, score, id]
  );

  return result.rows[0];
}

// Find existing skill for a student
async function findSkill(studentId, skillName) {
  const result = await pool.query(
    `SELECT ss.* FROM student_skills ss
     JOIN skills s ON ss.skill_id = s.id
     WHERE ss.student_id = $1 AND s.name = $2`,
    [studentId, skillName]
  );
  return result.rows[0];
}

// Get all skills for a student
async function getSkillsByStudentId(studentId) {
  const result = await pool.query(
    `SELECT ss.*, s.name as skill_name 
     FROM student_skills ss
     JOIN skills s ON ss.skill_id = s.id
     WHERE ss.student_id = $1`,
    [studentId]
  );

  return result.rows;
}

module.exports = {
  addStudentSkill,
  updateStudentSkill,
  findSkill,
  getSkillsByStudentId,
};
