import { NextFunction, Request, Response } from "express";

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  const status = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const details = error.details || undefined;
  res.status(status).json({ message, details });
}
