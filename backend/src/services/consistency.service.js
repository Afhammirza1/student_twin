const { findStudentByUserId } = require("../models/student.model");
const pool = require("../config/db");

async function getConsistency(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  // Use score_history (reliably timestamped) to compute active days in last 7 days
  const result = await pool.query(
    `SELECT DISTINCT DATE(created_at) as active_day
     FROM score_history
     WHERE student_id = $1
       AND created_at >= NOW() - INTERVAL '7 days'`,
    [student.id]
  );

  const activeDays = result.rows.length;
  const totalDays = 7;

  const consistency = Math.round((activeDays / totalDays) * 100);

  return {
    consistency,
    activeDays,
    totalDays,
    // Aliases consumed by the Report.jsx frontend
    completed: activeDays,
    weeklyGoal: totalDays,
  };
}

module.exports = { getConsistency };
