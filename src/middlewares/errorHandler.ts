import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number , code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

//Global Middleware to handle errors
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_SERVER_ERROR";
  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};
