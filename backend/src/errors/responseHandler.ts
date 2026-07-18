import { Response } from "express";
import { AppError, ValidationError } from "./AppError";
import logger from "../utils/logger";
import { config } from "../config";

interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>({
    res,
    statusCode = 200,
    message = "Success",
    data,
    meta,
  }: SuccessResponseOptions<T>): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    });
  }

  static created<T>(res: Response, data: T, message = "Created successfully"): Response {
    return this.success({ res, statusCode: 201, message, data });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message = "Success"
  ): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: { pagination },
    });
  }
}

export class ErrorResponse {
  static send(error: unknown, res: Response): Response {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    if (error instanceof AppError) {
      if (!error.isOperational) {
        logger.error("Non-operational error:", error);
      }
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error("Unexpected error:", error);

    return res.status(500).json({
      success: false,
      message: config.isProduction
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
}
