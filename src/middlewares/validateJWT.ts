import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.js";
import { ApiError } from "./errorHandler.js";

//Middleware to validate JWT token
const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError("No token provided", 401, "NO_TOKEN");
  }

  try {
    const decoded = verifyJwtToken(token as string);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(err as string, 401, "INVALID_TOKEN");
  }
};

export default validateJWT;