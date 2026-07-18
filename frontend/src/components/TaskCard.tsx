import type { Task } from "../types";
import {
  getStatusBadgeClass,
  getPriorityBadgeClass,
  formatDate,
  isOverdue,
} from "../utils/taskHelpers";
import { Card } from "./ui/Card";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isOptimistic?: boolean;
}

export function TaskCard({ task, onClick, isOptimistic }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Card
      className={`cursor-pointer border-slate-800/80 ${isOptimistic ? "opacity-70" : ""}`}
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(task)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{task.title}</h3>
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.description ? (
        <p className="mt-3 line-clamp-2 text-sm text-slate-400">
          {task.description}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
          {task.status}
        </span>
        {task.dueDate ? (
          <span
            className={`text-sm ${overdue ? "text-rose-300" : "text-slate-400"}`}
          >
            Due {formatDate(task.dueDate)}
          </span>
        ) : null}
      </div>

      {task.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
