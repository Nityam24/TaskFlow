import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { Task, TaskDocument } from "../models/Task";
import { NotFoundError } from "../errors/AppError";
import {
  PaginationMeta,
  PaginationQuery,
  TaskPriority,
  TaskStats,
  TaskStatus,
} from "../types";
import logger from "../utils/logger";

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  tags?: string[];
}

interface UpdateTaskInput extends Partial<CreateTaskInput> {}

const create = async (
  userId: string,
  input: CreateTaskInput,
): Promise<TaskDocument> => {
  const task = await Task.create({
    ...input,
    user: userId,
  });

  logger.info(`Task created: ${task._id} by user ${userId}`);
  return task;
};

const findByUser = async (
  userId: string,
  query: PaginationQuery,
): Promise<{ tasks: TaskDocument[]; pagination: PaginationMeta }> => {
  const parsedPage = Number(query.page ?? 1);
  const parsedLimit = Number(query.limit ?? 9);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 9;
  const skip = (page - 1) * limit;

  const filter: FilterQuery<TaskDocument> = {
    user: userId,
    isDeleted: false,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  const searchValue =
    typeof query.search === "string" ? query.search.trim() : "";
  if (searchValue) {
    filter.$text = { $search: searchValue };
  }

  const sortField =
    typeof query.sortBy === "string" && query.sortBy.trim()
      ? query.sortBy.trim()
      : "createdAt";
  const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;
  const sort: Record<string, SortOrder> = { [sortField]: sortOrder };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .lean<TaskDocument[]>(),
    Task.countDocuments(filter),
  ]);

  return {
    tasks: tasks as TaskDocument[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const findById = async (
  userId: string,
  taskId: string,
): Promise<TaskDocument> => {
  const task = await Task.findOne({
    _id: taskId,
    user: userId,
    isDeleted: false,
  })
    .select("-__v")
    .lean<TaskDocument>();

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task as TaskDocument;
};

const update = async (
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<TaskDocument> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId, isDeleted: false },
    { $set: input },
    { new: true, runValidators: true },
  ).select("-__v");

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  logger.info(`Task updated: ${taskId} by user ${userId}`);
  return task;
};

const remove = async (userId: string, taskId: string): Promise<void> => {
  const result = await Task.updateOne(
    { _id: taskId, user: userId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
  );

  if (result.modifiedCount === 0) {
    throw new NotFoundError("Task not found");
  }

  logger.info(`Task soft deleted: ${taskId} by user ${userId}`);
};

const getStats = async (userId: string): Promise<TaskStats> => {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const activeTaskMatch = { user: userObjectId, isDeleted: false };

  const overdueMatch = {
    ...activeTaskMatch,
    status: { $ne: TaskStatus.COMPLETED },
    dueDate: { $ne: null, $lt: todayStart },
  };

  const [statusAgg, priorityAgg, overdue, completedThisWeek, total] =
    await Promise.all([
      Task.aggregate([
        { $match: activeTaskMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: activeTaskMatch },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      Task.countDocuments(overdueMatch),
      Task.countDocuments({
        ...activeTaskMatch,
        status: TaskStatus.COMPLETED,
        $or: [
          { completedAt: { $gte: weekAgo } },
          { updatedAt: { $gte: weekAgo } },
        ],
      }),
      Task.countDocuments(activeTaskMatch),
    ]);

  const byStatus = Object.values(TaskStatus).reduce(
    (acc, status) => {
      acc[status] = statusAgg.find((s) => s._id === status)?.count || 0;
      return acc;
    },
    {} as Record<TaskStatus, number>,
  );

  const byPriority = Object.values(TaskPriority).reduce(
    (acc, priority) => {
      acc[priority] = priorityAgg.find((p) => p._id === priority)?.count || 0;
      return acc;
    },
    {} as Record<TaskPriority, number>,
  );

  return {
    total,
    byStatus,
    byPriority,
    overdue,
    completedThisWeek,
  };
};

export const taskService = {
  create,
  findByUser,
  findById,
  update,
  delete: remove,
  getStats,
};
