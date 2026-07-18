import { useState } from "react";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { TaskForm } from "../components/TaskForm";
import { Pagination } from "../components/Pagination";
import { useTasks, useCreateTask } from "../hooks/useTasks";
import { useAppDispatch } from "../store/hooks";
import { setFilters } from "../store";
import { getErrorMessage } from "../api/client";
import type { Task, CreateTaskInput } from "../types";
import {
  TaskStatus as StatusEnum,
  TaskPriority as PriorityEnum,
} from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function TasksPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, error } = useTasks();
  const createTask = useCreateTask();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [search, setSearch] = useState("");

  const tasks = data?.data || [];
  const pagination = data?.meta?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(
      setFilters({
        [key]: value || undefined,
        page: 1,
      }),
    );
  };

  const handleCreate = async (formData: CreateTaskInput) => {
    setCreateError("");
    try {
      await createTask.mutateAsync(formData);
      setShowCreateModal(false);
    } catch (err) {
      setCreateError(getErrorMessage(err));
    }
  };

  return (
    <div className="page-section container space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My tasks</h1>
          <p className="page-subtitle">
            Stay focused with a structured view of your work.
          </p>
          {isFetching && !isLoading ? (
            <p className="mt-2 text-sm text-slate-400">Updating…</p>
          ) : null}
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ New task</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <select
            className="input-field max-w-[180px]"
            onChange={(e) => handleFilterChange("status", e.target.value)}
            defaultValue=""
          >
            <option value="">All statuses</option>
            {Object.values(StatusEnum).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="input-field max-w-[180px]"
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            defaultValue=""
          >
            <option value="">All priorities</option>
            {Object.values(PriorityEnum).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className="input-field max-w-[180px]"
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            defaultValue="createdAt"
          >
            <option value="createdAt">Sort: created</option>
            <option value="dueDate">Sort: due date</option>
            <option value="priority">Sort: priority</option>
            <option value="title">Sort: title</option>
          </select>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {getErrorMessage(error)}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="px-8 py-12 text-center">
          <h3 className="text-xl font-semibold text-white">No tasks yet</h3>
          <p className="mt-2 text-slate-400">
            Create your first task to get started.
          </p>
          <Button className="mt-6" onClick={() => setShowCreateModal(true)}>
            Create task
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onClick={setSelectedTask} />
            ))}
          </div>

          {pagination ? (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
            />
          ) : null}
        </>
      )}

      {selectedTask ? (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      ) : null}

      {showCreateModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Create new task
              </h2>
              <button
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            {createError ? (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {createError}
              </div>
            ) : null}
            <TaskForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
              isLoading={createTask.isPending}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
