const express = require("express");
const router = express.Router();
const { handleFocusXP, handleGetQuest, handleCompleteQuest } = require("../controllers/gamification.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/focus", authMiddleware, handleFocusXP);
router.get("/quest", authMiddleware, handleGetQuest);
router.post("/quest/complete", authMiddleware, handleCompleteQuest);

module.exports = router;
