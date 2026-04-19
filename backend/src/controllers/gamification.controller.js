const { rewardFocusXP, getDailyQuest, completeDailyQuest } = require("../services/gamification.service");
const { success, error } = require("../utils/response");

async function handleFocusXP(req, res) {
  try {
    const data = await rewardFocusXP(req.user.userId);
    return success(res, data, data.message);
  } catch (err) {
    return error(res, err.message);
  }
}

async function handleGetQuest(req, res) {
  try {
    const data = await getDailyQuest(req.user.userId);
    return success(res, data, "Quest fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

async function handleCompleteQuest(req, res) {
  try {
    const data = await completeDailyQuest(req.user.userId);
    return success(res, data, data.message);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { handleFocusXP, handleGetQuest, handleCompleteQuest };
