import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 100 requests
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
});