const rateLimit = require("express-rate-limit");

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Strict limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 AI requests per window
  message: {
    success: false,
    message: "AI rate limit reached. Try again later.",
  },
});

// Auth rate limit (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

module.exports = { apiLimiter, aiLimiter, authLimiter };
