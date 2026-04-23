const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { generate, submit } = require("../controllers/quiz.controller");

router.post("/generate", authMiddleware, generate);
router.post("/submit", authMiddleware, submit);

module.exports = router;
