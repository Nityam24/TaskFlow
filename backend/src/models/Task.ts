import mongoose, { Document, Schema } from "mongoose";
import { ITask, TaskPriority, TaskStatus } from "../types";

export interface TaskDocument extends Omit<ITask, "_id" | "user">, Document {
  user: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
  isDeleted: boolean;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    estimatedHours: {
      type: Number,
      default: 0,
      min: [0, "Estimated hours cannot be negative"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound indexes for optimized queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

taskSchema.pre("save", function (next) {
  const doc = this as mongoose.Document & TaskDocument;

  if (doc.isModified("status")) {
    if (doc.status === TaskStatus.COMPLETED) {
      if (!doc.completedAt) {
        doc.completedAt = new Date();
      }
    } else {
      doc.completedAt = null;
    }
  }

  next();
});

export const Task = mongoose.model<TaskDocument>("Task", taskSchema);
