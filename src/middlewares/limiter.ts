import { rateLimit } from "express-rate-limit";

const rateLimitResponse = {
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests, please try again later",
  },
};

const createLimiter = (windowMs: number, limit: number) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: rateLimitResponse,
  });

export const apiLimiter = createLimiter(15 * 60 * 1000, 100);
export const authLimiter = createLimiter(15 * 60 * 1000, 10);
export const bookingLimiter = createLimiter(15 * 60 * 1000, 30);
