const {
  startSession,
  stopSession,
  getAllSessions,
  getFocusTimeToday,
} = require("../services/session.service");
const { success, error } = require("../utils/response");

async function start(req, res) {
  try {
    const userId = req.user.userId;

    const session = await startSession(userId);

    return success(res, session, "Session started");
  } catch (err) {
    return error(res, err.message);
  }
}

async function stop(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId || !Number.isInteger(Number(sessionId))) {
      return error(res, "Valid numeric sessionId is required");
    }

    const session = await stopSession(Number(sessionId));

    return success(res, session, "Session stopped");
  } catch (err) {
    return error(res, err.message);
  }
}

async function getSessions(req, res) {
  try {
    const userId = req.user.userId;

    const sessions = await getAllSessions(userId);

    return success(res, sessions, "Sessions fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

async function focusToday(req, res) {
  try {
    const userId = req.user.userId;

    const data = await getFocusTimeToday(userId);

    return success(res, data, "Focus time fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  start,
  stop,
  getSessions,
  focusToday,
};
