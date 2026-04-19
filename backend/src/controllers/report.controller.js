const { getWeeklyReport, getWeeklyReportAI } = require("../services/report.service");
const { success, error } = require("../utils/response");

async function fetchReport(req, res) {
  try {
    const userId = req.user.userId;

    const data = await getWeeklyReport(userId);

    return success(res, data, "Report fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

// AI-enhanced report
async function fetchReportAI(req, res) {
  try {
    const userId = req.user.userId;

    const data = await getWeeklyReportAI(userId);

    return success(res, data, "AI report generated");
  } catch (err) {
    return error(res, err.message, 500);
  }
}

module.exports = { fetchReport, fetchReportAI };
