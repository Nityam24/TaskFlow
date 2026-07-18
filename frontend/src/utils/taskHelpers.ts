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
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseDateOnly(value?: string): Date | null {
  if (!value) return null;

  const trimmedValue = value.trim();
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(trimmedValue);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function isOverdue(
  dueDate?: string,
  status?: TaskStatus,
  _startDate?: string,
): boolean {
  if (!dueDate || status === TaskStatus.COMPLETED) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = parseDateOnly(dueDate);
  if (!due) return false;

  return due < today;
}
