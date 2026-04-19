const pool = require("../config/db");

// Start session
async function createSession(studentId, startTime) {
  const result = await pool.query(
    "INSERT INTO study_sessions (student_id, start_time) VALUES ($1, $2) RETURNING *",
    [studentId, startTime]
  );
  return result.rows[0];
}

// Get session by id
async function getSessionById(sessionId) {
  const result = await pool.query(
    "SELECT * FROM study_sessions WHERE id = $1",
    [sessionId]
  );
  return result.rows[0];
}

// End session
async function endSession(sessionId, endTime, duration) {
  const result = await pool.query(
    "UPDATE study_sessions SET end_time=$1, duration=$2 WHERE id=$3 RETURNING *",
    [endTime, duration, sessionId]
  );
  return result.rows[0];
}

// Get sessions
async function getSessions(studentId) {
  const result = await pool.query(
    "SELECT * FROM study_sessions WHERE student_id=$1 ORDER BY start_time DESC",
    [studentId]
  );
  return result.rows;
}

// Get total focus time today
async function getTodayFocusTime(studentId) {
  const result = await pool.query(
    `SELECT COALESCE(SUM(duration), 0) AS total_minutes 
     FROM study_sessions 
     WHERE student_id = $1 
     AND DATE(start_time) = CURRENT_DATE
     AND duration IS NOT NULL`,
    [studentId]
  );
  return parseInt(result.rows[0].total_minutes, 10);
}

module.exports = {
  createSession,
  getSessionById,
  endSession,
  getSessions,
  getTodayFocusTime,
};
