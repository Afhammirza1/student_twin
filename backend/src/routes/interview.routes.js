const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { start, answer } = require("../controllers/interview.controller");

router.post("/start", authMiddleware, start);
router.post("/answer", authMiddleware, answer);

module.exports = router;
