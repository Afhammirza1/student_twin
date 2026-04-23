const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getNotifications, markRead, markAllRead } = require("../controllers/notification.controller");

router.get("/", auth, getNotifications);
router.put("/read-all", auth, markAllRead);
router.put("/:id/read", auth, markRead);

module.exports = router;
