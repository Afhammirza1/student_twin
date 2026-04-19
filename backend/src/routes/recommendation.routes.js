const express = require("express");
const router = express.Router();

const {
  fetchRecommendations,
} = require("../controllers/recommendation.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, fetchRecommendations);

module.exports = router;
