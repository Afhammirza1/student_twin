const { fetchPublicProfile, getLeaderboard } = require("../services/public.service");

async function getPublicProfile(req, res) {
  try {
    const { username } = req.params;

    const data = await fetchPublicProfile(username);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getLeaderboardHandler(req, res) {
  try {
    const data = await getLeaderboard();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getPublicProfile, getLeaderboardHandler };
