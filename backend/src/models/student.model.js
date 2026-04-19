const pool = require("../config/db");

// Create student profile
async function createStudent(userId) {
  const result = await pool.query(
    "INSERT INTO students (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  return result.rows[0];
}

// Get student by userId
async function findStudentByUserId(userId) {
  const result = await pool.query(
    "SELECT * FROM students WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
}

// Add XP natively
async function addXP(userId, amount) {
  const result = await pool.query(
    "UPDATE students SET xp = xp + $1 WHERE user_id = $2 RETURNING xp",
    [amount, userId]
  );
  return result.rows[0];
}

// Update AI Summary
async function updateAiSummary(studentId, summaryText) {
  const result = await pool.query(
    "UPDATE students SET ai_summary = $1 WHERE id = $2 RETURNING ai_summary",
    [summaryText, studentId]
  );
  return result.rows[0];
}

module.exports = {
  createStudent,
  findStudentByUserId,
  addXP,
  updateAiSummary,
};
