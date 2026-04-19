const express = require("express");
const router = express.Router();

const {
  getRoadmapHandler,
  downloadCalendar,
} = require("../controllers/roadmap.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, getRoadmapHandler);
router.post("/calendar", authMiddleware, downloadCalendar);

module.exports = router;
