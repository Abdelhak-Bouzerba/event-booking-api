import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.js";

//Middleware to validate JWT token
const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = verifyJwtToken(token as string);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default validateJWT;