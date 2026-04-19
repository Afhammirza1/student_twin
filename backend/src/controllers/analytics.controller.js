const { getAnalytics, getProgress } = require("../services/analytics.service");
const { success, error } = require("../utils/response");

async function fetchAnalytics(req, res) {
  try {
    const userId = req.user.userId;

    const data = await getAnalytics(userId);

    return success(res, data, "Analytics fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

async function fetchProgress(req, res) {
  try {
    const userId = req.user.userId;

    const data = await getProgress(userId);

    return success(res, data, "Progress fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { fetchAnalytics, fetchProgress };
