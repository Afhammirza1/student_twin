const { linkGithubUsername, syncGithubRepos } = require("../services/github.service");
const { success, error } = require("../utils/response");

async function linkUserGithub(req, res) {
  try {
    const userId = req.user.userId;
    const { username } = req.body;
    
    if (!username) {
      return error(res, "GitHub username required");
    }

    const data = await linkGithubUsername(userId, username);
    return success(res, data, "GitHub linked");
  } catch (err) {
    return error(res, err.message);
  }
}

async function syncGithub(req, res) {
  try {
    const userId = req.user.userId;
    const data = await syncGithubRepos(userId);
    return success(res, data, "GitHub synced");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { linkUserGithub, syncGithub };
