import { Request, Response, NextFunction } from "express";
import { AnyObjectSchema, ValidationError as YupValidationError } from "yup";
import { ValidationError } from "../errors/AppError";

type ValidationSource = "body" | "query" | "params";

export const validate =
  (schema: AnyObjectSchema, source: ValidationSource = "body") =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof YupValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        next(new ValidationError(errors));
        return;
      }
      next(error);
    }
  };
