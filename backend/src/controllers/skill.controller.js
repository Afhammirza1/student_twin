const { createSkill } = require("../services/skill.service");
const { success, error } = require("../utils/response");

async function addSkill(req, res) {
  try {
    const userId = req.user.userId;
    const { skillName, level, projects, certifications } = req.body;

    // ── Validation ──
    if (!skillName || typeof skillName !== "string" || skillName.trim().length === 0) {
      return error(res, "Skill name is required");
    }
    if (skillName.trim().length > 100) {
      return error(res, "Skill name must be under 100 characters");
    }
    const lvl = Number(level);
    if (!Number.isInteger(lvl) || lvl < 1 || lvl > 10) {
      return error(res, "Level must be an integer between 1 and 10");
    }
    const proj = Number(projects);
    if (!Number.isInteger(proj) || proj < 0 || proj > 50) {
      return error(res, "Projects must be between 0 and 50");
    }
    const certs = Number(certifications);
    if (!Number.isInteger(certs) || certs < 0 || certs > 50) {
      return error(res, "Certifications must be between 0 and 50");
    }

    const skill = await createSkill(
      { skillName: skillName.trim(), level: lvl, projects: proj, certifications: certs },
      userId
    );

    return success(res, skill, "Skill added");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { addSkill };

