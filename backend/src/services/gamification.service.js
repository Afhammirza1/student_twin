const pool = require("../config/db");
const { findStudentByUserId, addXP } = require("../models/student.model");
const { generateAIResponse } = require("./ai.service");
const { getSkillsByStudentId } = require("../models/studentSkill.model");

// Phase 2: Focus Mode
async function rewardFocusXP(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  const focusXP = 15; // 15 XP for a solid focus block
  await addXP(userId, focusXP);
  
  return { xpEarned: focusXP, message: "Focus complete! 15 XP earned." };
}

// Phase 4: Daily Quests
async function getDailyQuest(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  const today = new Date().toISOString().split('T')[0];
  
  if (student.quest_date) {
    const qDate = new Date(student.quest_date).toISOString().split('T')[0];
    if (qDate === today) {
      return { 
        quest: student.current_quest, 
        completed: student.quest_completed 
      };
    }
  }

  const skills = await getSkillsByStudentId(student.id);
  let targetSkill = "general programming fundamentals";
  if (skills && skills.length > 0) {
    const lowest = skills.reduce((min, s) => s.score < min.score ? s : min, skills[0]);
    targetSkill = lowest.skill_name || targetSkill;
  }

  const prompt = `You are a strict but encouraging coding mentor. Your student is weak at '${targetSkill}'. 
  Give them a single, highly actionable, 5-minute 'Micro-Quest' to complete right now. Do not include pleasantries. Keep it under 2 sentences. Example: 'Read the MDN documentation on Map and Filter'`;

  let newQuest = "Read a tech article on a topic you struggle with.";
  try {
    const aiResp = await generateAIResponse(prompt);
    if (aiResp) newQuest = aiResp;
  } catch (err) {
    console.error("AI Quest Gen Error:", err);
  }

  await pool.query(
    "UPDATE students SET current_quest = $1, quest_date = $2, quest_completed = false WHERE id = $3",
    [newQuest, today, student.id]
  );

  return { quest: newQuest, completed: false };
}

async function completeDailyQuest(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");
  if (student.quest_completed) throw new Error("Quest already completed today!");

  await pool.query(
    "UPDATE students SET quest_completed = true WHERE id = $1",
    [student.id]
  );
  
  const questXP = 20; 
  await addXP(userId, questXP);

  return { xpEarned: questXP, message: "Quest Complete!" };
}

module.exports = { rewardFocusXP, getDailyQuest, completeDailyQuest };
