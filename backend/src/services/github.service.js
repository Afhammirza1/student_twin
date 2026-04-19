const axios = require("axios");
const pool = require("../config/db");
const { findStudentByUserId, addXP } = require("../models/student.model");

async function linkGithubUsername(userId, githubUsername) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  await pool.query(
    "UPDATE students SET github_username = $1 WHERE id = $2",
    [githubUsername, student.id]
  );
  return { success: true, message: "GitHub linked successfully" };
}

async function syncGithubRepos(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");
  if (!student.github_username) throw new Error("No GitHub account linked");

  let repos;
  try {
    const username = student.github_username.trim();
    const config = {
      headers: {
        'User-Agent': 'StudentTwin-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, config);
    repos = response.data;
  } catch (err) {
    console.error("GitHub API Error:", err.response?.data?.message || err.message);
    if (err.response?.status === 403 && err.response?.data?.message?.includes("rate limit")) {
       throw new Error("GitHub API rate limit exceeded. Please try again later.");
    } else if (err.response?.status === 404) {
       throw new Error(`GitHub user '${student.github_username.trim()}' not found. Ensure the username is correct.`);
    }
    throw new Error("Failed to fetch Github profile. Ensure the username is correct.");
  }
  
  if (!repos || repos.length === 0) {
     return { message: "No public repos found to sync", xpEarned: 0 };
  }

  // Calculate score: Simple mapping based on total public repos and forks
  const originalRepos = repos.filter(r => !r.fork).length;
  const xpReward = originalRepos * 5; // 5 XP per original repo

  if (xpReward > 0) {
    await addXP(userId, xpReward);
  }

  return {
    totalReposFound: repos.length,
    originalRepos,
    xpEarned: xpReward,
    message: `Successfully synced repos and earned ${xpReward} XP!`
  };
}

module.exports = { linkGithubUsername, syncGithubRepos };
