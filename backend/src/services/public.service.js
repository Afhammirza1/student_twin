const pool = require("../config/db");
const { generateAIResponse } = require("./ai.service");
const { calculateBadges } = require("./badge.service");

async function fetchPublicProfile(username) {
  // Get user + student data
  const userRes = await pool.query(
    `SELECT u.id, u.name, s.id as student_id, s.xp, s.streak, s.ai_summary, s.github_username, s.readiness
     FROM users u
     JOIN students s ON u.id = s.user_id
     WHERE LOWER(u.name) = LOWER($1)`,
    [username]
  );

  if (userRes.rows.length === 0) throw new Error("User not found");
  const user = userRes.rows[0];

  // BUG 1 FIX: properly JOIN skills table to get skill_name
  const skillsRes = await pool.query(
    `SELECT ss.score, ss.level, ss.projects, ss.certifications, sk.name AS skill_name
     FROM student_skills ss
     JOIN skills sk ON ss.skill_id = sk.id
     WHERE ss.student_id = $1
     ORDER BY ss.score DESC`,
    [user.student_id]
  );
  const skills = skillsRes.rows;

  // Calc readiness from skill average if not stored
  const avg = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + (s.score || 0), 0) / skills.length)
    : 0;
  const readiness = user.readiness || avg;

  // Get GitHub repo count if github_username exists
  let githubRepos = 0;
  if (user.github_username) {
    try {
      const ghRes = await pool.query(
        `SELECT COUNT(*) as count FROM github_repos WHERE student_id = $1`,
        [user.student_id]
      );
      githubRepos = parseInt(ghRes.rows[0]?.count || 0);
    } catch {
      // table may not exist yet — non-critical
    }
  }

  // Use stored AI summary or generate a fresh one
  let summary = user.ai_summary || null;
  if (!summary && skills.length > 0) {
    const prompt = `Student profile: ${skills.map(s => `${s.skill_name} (${s.score}/100)`).join(", ")}.
Write a 2-sentence professional summary for this student's public portfolio. Be specific and positive.`;
    try {
      const ai = await generateAIResponse(prompt);
      if (ai) summary = ai;
    } catch {
      // non-critical — skip silently
    }
  }

  const badges = calculateBadges(
    { streak: user.streak || 0, xp: user.xp || 0, github_username: user.github_username || null },
    skills
  );

  return {
    name: user.name,
    skills,
    readiness,
    xp: user.xp || 0,
    streak: user.streak || 0,
    summary: summary || null,
    badges,
    githubUsername: user.github_username || null,
    githubRepos,
  };
}

async function getLeaderboard() {
  const res = await pool.query(`
    SELECT u.name, u.email, s.xp, s.streak, s.readiness
    FROM students s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.xp DESC, s.streak DESC
    LIMIT 20
  `);
  return res.rows;
}

module.exports = { fetchPublicProfile, getLeaderboard };
