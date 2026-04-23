const { getUserNotifications, readNotification, readAllNotifications } = require("../services/notification.service");
const { success, error } = require("../utils/response");

async function getNotifications(req, res) {
  try {
    const userId = req.user.userId;
    const data = await getUserNotifications(userId);
    return success(res, data, "Notifications fetched");
  } catch (err) {
    return error(res, err.message);
  }
}

async function markRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await readNotification(id);
    if (!notification) return error(res, "Notification not found", 404);
    return success(res, notification, "Marked as read");
  } catch (err) {
    return error(res, err.message);
  }
}

async function markAllRead(req, res) {
  try {
    const userId = req.user.userId;
    await readAllNotifications(userId);
    return success(res, null, "All notifications marked as read");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getNotifications, markRead, markAllRead };
