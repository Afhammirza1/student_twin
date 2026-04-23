const pool = require("../config/db");

// Safe integer conversion — returns 0 for NaN/empty/null instead of NaN
function toInt(val) {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? 0 : n;
}

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

  // Ensure proper data types — never pass NaN or empty string for integer columns
  const studentIdNum = toInt(studentId);
  const levelNum = toInt(level);
  const projectsNum = toInt(projects);
  const certificationsNum = toInt(certifications);
  const scoreNum = toInt(score);
  const skillNameStr = String(skillName || '').trim();

  // Ensure skill exists in the skills table (auto-create if needed)
  try {
    await pool.query(
      `INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [skillNameStr]
    );
  } catch (error) {
    // Fallback if ON CONFLICT fails due to missing unique constraint
    if (error.message.includes('no unique or exclusion constraint')) {
      await pool.query(
        `INSERT INTO skills (name) SELECT $1::text WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = $1::text)`,
        [skillNameStr]
      );
    } else {
      throw error;
    }
  }

  const result = await pool.query(
    `INSERT INTO student_skills 
    (student_id, skill_id, level, projects, certifications, score)
    VALUES ($1, 
      (SELECT id FROM skills WHERE name = $2),
      $3, $4, $5, $6)
    RETURNING *`,
    [studentIdNum, skillNameStr, levelNum, projectsNum, certificationsNum, scoreNum]
  );

  return result.rows[0];
}

// Update existing skill
async function updateStudentSkill(id, data) {
  const { level, projects, certifications, score } = data;

  // Ensure proper data types
  const idNum = toInt(id);
  const levelNum = toInt(level);
  const projectsNum = toInt(projects);
  const certificationsNum = toInt(certifications);
  const scoreNum = toInt(score);

  const result = await pool.query(
    `UPDATE student_skills 
     SET level = $1, projects = $2, certifications = $3, score = $4
     WHERE id = $5
     RETURNING *`,
    [levelNum, projectsNum, certificationsNum, scoreNum, idNum]
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
