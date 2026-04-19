const { createSkill } = require("../services/skill.service");
const { success, error } = require("../utils/response");

async function addSkill(req, res) {
  try {
    const userId = req.user.userId;

    const skill = await createSkill(req.body, userId);

    return success(res, skill, "Skill added");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { addSkill };
