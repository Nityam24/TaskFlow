import * as yup from "yup";
import { TaskPriority, TaskStatus } from "../types";

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const createTaskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters")
    .required("Title is required"),
  description: yup.string().trim().max(2000).default(""),
  status: yup
    .string()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .default(TaskStatus.TODO),
  priority: yup
    .string()
    .oneOf(Object.values(TaskPriority), "Invalid priority")
    .default(TaskPriority.MEDIUM),
  startDate: yup.date().nullable().optional(),
  dueDate: yup
    .date()
    .nullable()
    .optional()
    .when("startDate", ([startDate], schema) =>
      startDate
        ? schema.min(startDate, "Due date must be after start date")
        : schema
    ),
  estimatedHours: yup.number().min(0).default(0),
  tags: yup.array().of(yup.string().trim()).default([]),
});

export const updateTaskSchema = yup.object({
  title: yup.string().trim().min(1).max(200).optional(),
  description: yup.string().trim().max(2000).optional(),
  status: yup.string().oneOf(Object.values(TaskStatus)).optional(),
  priority: yup.string().oneOf(Object.values(TaskPriority)).optional(),
  startDate: yup.date().nullable().optional(),
  dueDate: yup.date().nullable().optional(),
  estimatedHours: yup.number().min(0).optional(),
  tags: yup.array().of(yup.string().trim()).optional(),
});

export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
  status: yup.string().oneOf(Object.values(TaskStatus)).optional(),
  priority: yup.string().oneOf(Object.values(TaskPriority)).optional(),
  search: yup.string().trim().max(100).optional(),
  sortBy: yup
    .string()
    .oneOf(["createdAt", "dueDate", "priority", "title", "status"])
    .default("createdAt"),
  sortOrder: yup.string().oneOf(["asc", "desc"]).default("desc"),
});

export const mongoIdSchema = yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
