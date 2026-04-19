const pool = require("../config/db");
const { generateAIResponse } = require("./ai.service");
const { calculateBadges } = require("./badge.service");

async function fetchPublicProfile(username) {
  // 🔹 Get user and link to student (include xp, streak, ai_summary)
  const userRes = await pool.query(
    `SELECT u.id, u.name, s.id as student_id, s.xp, s.streak, s.ai_summary
     FROM users u
     JOIN students s ON u.id = s.user_id
     WHERE u.name=$1`,
    [username]
  );

  if (userRes.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userRes.rows[0];

  // 🔹 Get skills (include level)
  const skillsRes = await pool.query(
    `SELECT s.name, ss.score, ss.level
     FROM student_skills ss
     JOIN skills s ON s.id = ss.skill_id
     WHERE ss.student_id=$1`,
    [user.student_id]
  );

  const skills = skillsRes.rows;

  // 🔹 Calculate readiness (simple)
  const avg =
    skills.reduce((acc, s) => acc + s.score, 0) /
    (skills.length || 1);

  const readiness = Math.round(avg);

  // 🔥 Use stored AI summary, or generate fresh one
  let aiSummary = user.ai_summary || null;

  if (!aiSummary && skills.length > 0) {
    const prompt = `
    Student Skills:
    ${skills.map(s => `${s.name}: ${s.score}`).join(", ")}

    Generate a short professional summary.
    `;

    try {
      const ai = await generateAIResponse(prompt);
      if (ai) aiSummary = ai;
    } catch {}
  }
  
  const badges = calculateBadges({ streak: user.streak || 0, xp: user.xp || 0, github_username: user.github_username || null }, skills);

  return {
    name: user.name,
    skills,
    readiness,
    xp: user.xp || 0,
    streak: user.streak || 0,
    aiSummary: aiSummary || "No summary available",
    badges
  };
}

async function getLeaderboard() {
  const res = await pool.query(`
    SELECT u.name, s.xp, s.streak, s.readiness
    FROM students s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.xp DESC, s.streak DESC
    LIMIT 10
  `);
  
  return res.rows;
}

module.exports = { fetchPublicProfile, getLeaderboard };
