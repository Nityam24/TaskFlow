import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { CreateTaskInput, TaskModalProps } from "../types";
import {
  getStatusBadgeClass,
  getPriorityBadgeClass,
  formatDateTime,
  isOverdue,
} from "../utils/taskHelpers";
import { TaskForm } from "./TaskForm";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { getErrorMessage } from "../api/client";
import { Button } from "./ui/Button";

export function TaskModal({
  task,
  onClose,
  onTaskUpdated,
  mode: initialMode = "view",
}: TaskModalProps) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  if (!currentTask) return null;

  const handleUpdate = async (data: CreateTaskInput) => {
    try {
      const response = await updateTask.mutateAsync({
        id: currentTask._id,
        data,
      });
      const updatedTask = response?.data?.task;

      if (updatedTask) {
        setCurrentTask(updatedTask);
        onTaskUpdated?.(updatedTask);
      }

      toast.success("Task updated successfully");
      setMode("view");
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(currentTask._id);
      toast.success("Task deleted successfully");
      onClose();
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const overdue = isOverdue(
    currentTask.dueDate,
    currentTask.status,
    currentTask.startDate,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {updateTask.isPending || deleteTask.isPending ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-950/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
              Working on task...
            </div>
          </div>
        ) : null}
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">
              Task details
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {mode === "edit" ? "Edit task" : currentTask.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {showDeleteConfirm ? (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-xl">
              <div
                className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900/80 p-6 shadow-2xl backdrop-blur"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-lg font-semibold text-white">
                  Delete this task?
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  This action cannot be undone. The task will be removed from
                  your list.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Confirm delete
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
          {mode === "view" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(currentTask.status)}`}
                >
                  {currentTask.status}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getPriorityBadgeClass(currentTask.priority)}`}
                >
                  {currentTask.priority}
                </span>
                {overdue && (
                  <span className="rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-sm font-medium text-rose-200">
                    Overdue
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Description
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300/80">
                  {currentTask.description ||
                    "No description was added for this task yet."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Start date
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {formatDateTime(currentTask.startDate)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Due date
                  </p>
                  <p
                    className={`mt-2 text-sm ${overdue ? "text-rose-300" : "text-slate-200"}`}
                  >
                    {formatDateTime(currentTask.dueDate)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Estimated hours
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {currentTask.estimatedHours}h
                  </p>
                </div>
              </div>

              {currentTask.tags.length > 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentTask.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-sm text-indigo-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
                <Button onClick={() => setMode("edit")}>Edit</Button>
              </div>
            </div>
          ) : (
            <TaskForm
              task={currentTask}
              onSubmit={handleUpdate}
              onCancel={() => setMode("view")}
              isLoading={updateTask.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
