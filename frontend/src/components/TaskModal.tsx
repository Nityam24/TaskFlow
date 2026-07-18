import { useState } from "react";
import type { Task, CreateTaskInput } from "../types";
import {
  getStatusBadgeClass,
  getPriorityBadgeClass,
  formatDateTime,
  isOverdue,
} from "../utils/taskHelpers";
import { TaskForm } from "./TaskForm";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { getErrorMessage } from "../api/client";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  mode?: "view" | "edit";
}

export function TaskModal({ task, onClose, mode: initialMode = "view" }: TaskModalProps) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [error, setError] = useState("");
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (!task) return null;

  const handleUpdate = async (data: CreateTaskInput) => {
    setError("");
    try {
      await updateTask.mutateAsync({ id: task._id, data });
      setMode("view");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask.mutateAsync(task._id);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "edit" ? "Edit Task" : task.title}</h2>
          <button className="btn btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {mode === "view" ? (
            <>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                  {task.status}
                </span>
                <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                  {task.priority}
                </span>
                {overdue && (
                  <span className="badge badge-critical">Overdue</span>
                )}
              </div>

              {task.description && (
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                  {task.description}
                </p>
              )}

              <div className="grid-2" style={{ marginBottom: "1rem" }}>
                <div>
                  <p className="form-label">Start Date</p>
                  <p>{formatDateTime(task.startDate)}</p>
                </div>
                <div>
                  <p className="form-label">Due Date</p>
                  <p style={{ color: overdue ? "var(--color-danger)" : undefined }}>
                    {formatDateTime(task.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="form-label">Estimated Hours</p>
                  <p>{task.estimatedHours}h</p>
                </div>
                <div>
                  <p className="form-label">Completed At</p>
                  <p>{formatDateTime(task.completedAt)}</p>
                </div>
              </div>

              {task.tags.length > 0 && (
                <div>
                  <p className="form-label">Tags</p>
                  <div className="task-card-tags">
                    {task.tags.map((tag) => (
                      <span key={tag} className="task-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-footer" style={{ padding: "1.5rem 0 0", border: "none" }}>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
                <button className="btn btn-primary" onClick={() => setMode("edit")}>
                  Edit
                </button>
              </div>
            </>
          ) : (
            <TaskForm
              task={task}
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
