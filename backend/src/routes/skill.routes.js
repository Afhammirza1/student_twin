const express = require("express");
const router = express.Router();

const { addSkill } = require("../controllers/skill.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateSkill = require("../middleware/validateSkill");

router.post("/", authMiddleware, validateSkill, addSkill);

module.exports = router;
