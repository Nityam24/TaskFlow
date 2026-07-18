import { TaskStatus, TaskPriority } from "../types";

export function getStatusBadgeClass(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: "badge-todo",
    [TaskStatus.IN_PROGRESS]: "badge-in-progress",
    [TaskStatus.IN_REVIEW]: "badge-in-review",
    [TaskStatus.COMPLETED]: "badge-completed",
    [TaskStatus.CANCELLED]: "badge-cancelled",
  };
  return map[status] || "badge-todo";
}

export function getPriorityBadgeClass(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "badge-low",
    [TaskPriority.MEDIUM]: "badge-medium",
    [TaskPriority.HIGH]: "badge-high",
    [TaskPriority.CRITICAL]: "badge-critical",
  };
  return map[priority] || "badge-medium";
}

export function formatDate(date?: string): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date?: string): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isOverdue(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === TaskStatus.COMPLETED) return false;
  return new Date(dueDate) < new Date();
}
