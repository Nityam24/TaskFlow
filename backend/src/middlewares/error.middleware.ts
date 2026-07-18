import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../errors/responseHandler";
import logger from "../utils/logger";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(`Error on ${req.method} ${req.path}:`, {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  });

  return ErrorResponse.send(error, res);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};
