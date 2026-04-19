const express = require("express");
const router = express.Router();

const { fetchAnalytics, fetchProgress } = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, fetchAnalytics);
router.get("/progress", authMiddleware, fetchProgress);

module.exports = router;
