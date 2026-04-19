const express = require("express");
const router = express.Router();
const { linkUserGithub, syncGithub } = require("../controllers/github.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/link", authMiddleware, linkUserGithub);
router.post("/sync", authMiddleware, syncGithub);

module.exports = router;
