const express = require("express");
const router = express.Router();

const { fetchReport, fetchReportAI } = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { aiLimiter } = require("../middleware/rateLimiter");

router.get("/", authMiddleware, fetchReport);
router.get("/ai", authMiddleware, aiLimiter, fetchReportAI);

module.exports = router;
