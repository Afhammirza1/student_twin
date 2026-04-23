const pool = require("../config/db");

// Create notification
async function createNotification(userId, type, title, message) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, title, message) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, type, title, message]
  );
  return result.rows[0];
}

// Get notifications for a user (latest 20)
async function getNotifications(userId) {
  const result = await pool.query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT 20`,
    [userId]
  );
  return result.rows;
}

// Get unread count
async function getUnreadCount(userId) {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM notifications 
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
}

// Mark single notification as read
async function markAsRead(notificationId) {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true 
     WHERE id = $1 RETURNING *`,
    [notificationId]
  );
  return result.rows[0];
}

// Mark all as read for a user
async function markAllAsRead(userId) {
  await pool.query(
    `UPDATE notifications SET is_read = true 
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return { success: true };
}

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
