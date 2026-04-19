const express = require("express");
const router = express.Router();

const { fetchConsistency } = require("../controllers/consistency.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, fetchConsistency);

module.exports = router;
