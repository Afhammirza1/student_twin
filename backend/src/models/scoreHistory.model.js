const pool = require("../config/db");

// Save score snapshot
async function saveScore(studentId, score) {
  const result = await pool.query(
    "INSERT INTO score_history (student_id, score) VALUES ($1, $2) RETURNING *",
    [studentId, score]
  );
  return result.rows[0];
}

// Get score history for a student
async function getScoreHistory(studentId) {
  const result = await pool.query(
    `SELECT score, created_at 
     FROM score_history 
     WHERE student_id = $1 
     ORDER BY created_at ASC`,
    [studentId]
  );
  return result.rows;
}

module.exports = {
  saveScore,
  getScoreHistory,
};
