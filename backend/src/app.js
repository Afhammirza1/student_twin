const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const skillRoutes = require("./routes/skill.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const roadmapRoutes = require("./routes/roadmap.routes");
const consistencyRoutes = require("./routes/consistency.routes");
const reportRoutes = require("./routes/report.routes");
const sessionRoutes = require("./routes/session.routes");
const summaryRoutes = require("./routes/summary.routes");
const publicRoutes = require("./routes/public.routes");
const githubRoutes = require("./routes/github.routes");
const gamificationRoutes = require("./routes/gamification.routes");
const notificationRoutes = require("./routes/notification.routes");
const quizRoutes = require("./routes/quiz.routes");
const interviewRoutes = require("./routes/interview.routes");
const errorHandler = require("./middleware/error.middleware");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();

// 🔐 Security
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));

// 🔥 Global rate limit
app.use("/api", apiLimiter);

// routes
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/consistency", consistencyRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/interview", interviewRoutes);

// 🔥 Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
