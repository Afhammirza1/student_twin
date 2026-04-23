const { createNotification, getNotifications, getUnreadCount, markAsRead, markAllAsRead } = require("../models/notification.model");

// Send a notification to a user
async function notify(userId, type, title, message) {
  try {
    return await createNotification(userId, type, title, message);
  } catch (err) {
    console.error("Notification Error:", err.message);
    // Non-critical: don't throw, just log
    return null;
  }
}

// Get all notifications for a user
async function getUserNotifications(userId) {
  const notifications = await getNotifications(userId);
  const unreadCount = await getUnreadCount(userId);
  return { notifications, unreadCount };
}

// Mark a notification as read
async function readNotification(notificationId) {
  return await markAsRead(notificationId);
}

// Mark all notifications as read
async function readAllNotifications(userId) {
  return await markAllAsRead(userId);
}

module.exports = { notify, getUserNotifications, readNotification, readAllNotifications };
