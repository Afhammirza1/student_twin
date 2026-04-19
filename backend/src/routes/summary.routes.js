const express = require("express");
const { getSummary, generateAiProfile } = require("../controllers/summary.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getSummary);
router.post("/generate-ai-profile", authMiddleware, generateAiProfile);

module.exports = router;
