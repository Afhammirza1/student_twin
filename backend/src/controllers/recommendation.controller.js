const { getRecommendations } = require("../services/recommendation.service");
const { success, error } = require("../utils/response");

async function fetchRecommendations(req, res) {
  try {
    const userId = req.user.userId;
    const useAI = req.query.useAI === "true";

    const data = await getRecommendations(userId, useAI);

    return success(res, data, "Recommendations fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { fetchRecommendations };
