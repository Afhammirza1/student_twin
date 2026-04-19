const express = require("express");
const router = express.Router();

const { getPublicProfile, getLeaderboardHandler } = require("../controllers/public.controller");

router.get("/leaderboard", getLeaderboardHandler);
router.get("/:username", getPublicProfile);

module.exports = router;
