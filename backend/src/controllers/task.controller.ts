import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";
import { ApiResponse } from "../errors/responseHandler";
import { BadRequestError } from "../errors/AppError";
import { mongoIdSchema } from "../validators";
import { sanitizeTaskPayload } from "../utils/serialize";

const getTaskId = (req: Request): string => {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
};

const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await taskService.create(req.user!.userId, req.body);
    ApiResponse.created(
      res,
      { task: sanitizeTaskPayload(task) },
      "Task created successfully",
    );
  } catch (error) {
    next(error);
  }
};

const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tasks, pagination } = await taskService.findByUser(
      req.user!.userId,
      req.query as Parameters<typeof taskService.findByUser>[1],
    );

    ApiResponse.paginated(res, sanitizeTaskPayload(tasks), pagination);
  } catch (error) {
    next(error);
  }
};

const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const taskId = getTaskId(req);
    const isValidId = await mongoIdSchema.isValid(taskId);
    if (!isValidId) {
      throw new BadRequestError("Invalid task ID");
    }

    const task = await taskService.findById(req.user!.userId, taskId);
    ApiResponse.success({ res, data: { task: sanitizeTaskPayload(task) } });
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const taskId = getTaskId(req);
    const isValidId = await mongoIdSchema.isValid(taskId);
    if (!isValidId) {
      throw new BadRequestError("Invalid task ID");
    }

    const task = await taskService.update(req.user!.userId, taskId, req.body);
    ApiResponse.success({
      res,
      message: "Task updated successfully",
      data: { task: sanitizeTaskPayload(task) },
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const taskId = getTaskId(req);
    const isValidId = await mongoIdSchema.isValid(taskId);
    if (!isValidId) {
      throw new BadRequestError("Invalid task ID");
    }

    await taskService.delete(req.user!.userId, taskId);
    ApiResponse.success({ res, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await taskService.getStats(req.user!.userId);
    ApiResponse.success({ res, data: { stats } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

export const taskController = {
  create,
  getAll,
  getById,
  update,
  delete: remove,
  getStats,
};
