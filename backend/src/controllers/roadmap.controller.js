const { getRoadmap, generateRoadmap } = require("../services/roadmap.service");
const { generateICS } = require("../utils/icsGenerator");
const { success, error } = require("../utils/response");

// 🔥 Hybrid: supports useAI flag
async function getRoadmapHandler(req, res) {
  try {
    const { goal, useAI } = req.body;

    if (!goal) {
      return error(res, "Goal is required");
    }

    const result = await getRoadmap({ goal, useAI });

    return success(res, result, "Roadmap generated");
  } catch (err) {
    return error(res, err.message);
  }
}

async function downloadCalendar(req, res) {
  try {
    const { goal } = req.body;

    if (!goal) {
      return error(res, "Goal is required");
    }

    const roadmap = generateRoadmap(goal);

    const icsFile = await generateICS(roadmap);

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=roadmap.ics");

    res.send(icsFile);
  } catch (err) {
    return error(res, err.message, 500);
  }
}

module.exports = {
  getRoadmapHandler,
  downloadCalendar,
};
