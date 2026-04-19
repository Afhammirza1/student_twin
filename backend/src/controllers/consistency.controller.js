const { getConsistency } = require("../services/consistency.service");
const { success, error } = require("../utils/response");

async function fetchConsistency(req, res) {
  try {
    const userId = req.user.userId;

    const data = await getConsistency(userId);

    return success(res, data, "Consistency fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { fetchConsistency };
