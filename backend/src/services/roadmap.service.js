const roadmaps = require("../config/roadmaps");
const { generateAIResponse } = require("./ai.service");
const { shouldUseAI } = require("./decision.service");

// Rule-based roadmap (fast, offline)
function generateRoadmap(goal) {
  const key = goal.toLowerCase();

  if (roadmaps[key]) {
    return roadmaps[key];
  }

  return [{ day: 1, task: "Define your goal clearly" }];
}

// Adaptive roadmap based on level and hours
function generateAdaptiveRoadmap({ goal, level, hoursPerDay }) {
  let roadmap = [];
  let day = 1;

  const baseTasks = [
    "Learn basics",
    "Practice problems",
    "Build mini project",
    "Read documentation",
    "Solve exercises",
    "Review concepts",
  ];

  const advancedTasks = [
    "Build full project",
    "Optimize code",
    "Deploy application",
    "Write tests",
    "Code review practice",
    "System design basics",
  ];

  const tasks = level === "beginner" ? baseTasks : advancedTasks;

  for (let task of tasks) {
    const repeat = hoursPerDay < 2 ? 2 : 1;

    for (let i = 0; i < repeat; i++) {
      roadmap.push({ day, task: `${goal} - ${task}` });
      day++;
    }
  }

  return roadmap;
}

// 🔥 Hybrid: AI-first with rule-based fallback
async function getRoadmap(data) {
  const { goal, useAI, level, hoursPerDay } = data;

  // Try AI first if allowed
  if (shouldUseAI(useAI, "roadmap")) {
    const prompt = `
Create a 30-day roadmap for becoming a ${goal}.
Give day-wise tasks in simple format.
Keep it practical and beginner-friendly.
`;

    const aiResponse = await generateAIResponse(prompt);

    if (aiResponse) {
      const formatted = aiResponse.split("\n").filter((line) => line.trim() !== "");
      return { type: "AI", roadmap: formatted };
    }
  }

  // Adaptive if level/hours provided
  if (level || hoursPerDay) {
    const roadmap = generateAdaptiveRoadmap({
      goal,
      level: level || "beginner",
      hoursPerDay: hoursPerDay || 2,
    });
    return { type: "ADAPTIVE", roadmap };
  }

  // Fallback to rule-based
  const roadmap = generateRoadmap(goal);

  return { type: "RULE_BASED", roadmap };
}

module.exports = { generateRoadmap, getRoadmap };
