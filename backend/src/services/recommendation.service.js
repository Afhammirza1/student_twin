const { getSkillsByStudentId } = require("../models/studentSkill.model");
const { findStudentByUserId } = require("../models/student.model");
const { generateAIResponse } = require("./ai.service");

async function getRecommendations(userId, useAI = false) {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw new Error("Student not found");
  }

  const skills = await getSkillsByStudentId(student.id);

  let recommendations = [];

  // 🔹 Rule-based recommendations
  for (let s of skills) {
    if (s.score < 40) {
      recommendations.push({
        skill: s.skill_name,
        level: "WEAK",
        score: s.score,
        message: `Improve ${s.skill_name} — your score is low`,
        action: "Build 2 projects + complete 1 certification",
      });
    } else if (s.score < 70) {
      recommendations.push({
        skill: s.skill_name,
        level: "MEDIUM",
        score: s.score,
        message: `Strengthen ${s.skill_name} with more practice`,
        action: "Take on 1 real-world project + earn an advanced certification",
      });
    }
  }

  // 🔥 Top 3 Priorities — sorted weakest first
  const topPriorities = skills
    .filter((s) => s.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => s.skill_name);

  // 🔥 Actionable Next Step
  const weakSkills = skills
    .filter((s) => s.score < 50)
    .sort((a, b) => a.score - b.score);

  const nextStep =
    weakSkills.length > 0
      ? `Work on ${weakSkills[0].skill_name} today for 1 hour`
      : skills.length > 0
      ? "Keep practicing your current skills"
      : "Start by adding your first skill";

  // 🔥 Dynamic Career Track Alignment
  const careerTracks = {
    "Frontend Developer": ["react", "javascript", "typescript", "html", "css", "vue", "angular", "next.js", "svelte", "tailwind"],
    "Backend Developer": ["java", "python", "node.js", "express", "spring", "django", "sql", "postgresql", "mongodb", "go", "rust", "c#", ".net"],
    "Full Stack Developer": ["react", "javascript", "node.js", "express", "mongodb", "sql", "html", "css", "python", "typescript"],
    "Data Scientist": ["python", "r", "sql", "pandas", "numpy", "tensorflow", "pytorch", "statistics", "machine learning", "data analysis"],
    "DevOps Engineer": ["docker", "kubernetes", "aws", "azure", "gcp", "linux", "ci/cd", "terraform", "ansible", "jenkins"],
    "Mobile Developer": ["react native", "flutter", "swift", "kotlin", "dart", "android", "ios", "java"],
    "AI/ML Engineer": ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "nlp", "computer vision", "opencv"],
  };

  const studentSkillNames = skills.map(s => s.skill_name.toLowerCase());
  
  let bestTrack = null;
  let bestMatchCount = 0;
  let bestMatchPercent = 0;
  let missingSkills = [];

  for (const [track, requiredSkills] of Object.entries(careerTracks)) {
    const matched = requiredSkills.filter(rs => studentSkillNames.some(ss => ss.includes(rs) || rs.includes(ss)));
    const matchPercent = Math.round((matched.length / requiredSkills.length) * 100);
    
    if (matched.length > bestMatchCount) {
      bestMatchCount = matched.length;
      bestMatchPercent = matchPercent;
      bestTrack = track;
      missingSkills = requiredSkills.filter(rs => !studentSkillNames.some(ss => ss.includes(rs) || rs.includes(ss))).slice(0, 3);
    }
  }

  if (bestTrack && bestMatchPercent < 60) {
    recommendations.push({
      skill: "Career Path",
      level: "INFO",
      score: bestMatchPercent,
      message: `You're ${bestMatchPercent}% aligned with ${bestTrack} roles`,
      action: `Learn ${missingSkills.join(", ")} to strengthen your path to ${bestTrack}`,
    });
  } else if (bestTrack) {
    recommendations.push({
      skill: "Career Path",
      level: "SUCCESS",
      score: bestMatchPercent,
      message: `You are ${bestMatchPercent}% aligned for ${bestTrack} roles`,
      action: "Keep building projects and contributing to open source",
    });
  }

  if (skills.length === 0) {
    recommendations.push({
      skill: "Getting Started",
      level: "INFO",
      score: null,
      message: "Start by adding your skills to get personalized suggestions",
      action: "Add at least 3 skills to see meaningful recommendations",
    });
  }

  // 🔥 AI enhancement
  let aiSuggestions = null;
  if (useAI && skills.length > 0) {
    const prompt = `
Student skills:
${skills.map((s) => `${s.skill_name}: score ${s.score}`).join(", ")}

Suggest personalized improvement tips in 3-4 bullet points.
Be specific and actionable.
`;

    const raw = await generateAIResponse(prompt);
    if (raw) {
      aiSuggestions = raw.split("\n").filter((line) => line.trim() !== "");
    }
  }

  return {
    recommendations,
    topPriorities,
    nextStep,
    aiSuggestions,
  };
}

module.exports = { getRecommendations };
