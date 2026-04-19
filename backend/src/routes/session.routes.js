const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  start,
  stop,
  getSessions,
  focusToday,
} = require("../controllers/session.controller");

router.post("/start", authMiddleware, start);
router.post("/stop", authMiddleware, stop);
router.get("/", authMiddleware, getSessions);
router.get("/focus-today", authMiddleware, focusToday);

module.exports = router;
