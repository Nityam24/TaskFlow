import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { toast } from "react-toastify";
import { TaskCard } from "../components/TaskCard";
import { useDebounce } from "../hooks/useDebounce";
import { TaskModal } from "../components/TaskModal";
import { TaskForm } from "../components/TaskForm";
import { Pagination } from "../components/Pagination";
import { useTasks, useCreateTask, taskKeys } from "../hooks/useTasks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetFilters, setFilters } from "../store";
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
  const queryClient = useQueryClient();
  const filters = useAppSelector((state) => state.taskFilters.filters);
  const { data, isLoading, isFetching, error } = useTasks();
  const createTask = useCreateTask();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const tasks = data?.data || [];
  const pagination = data?.meta?.pagination;

  const statusOptions = [
    { value: "", label: "All statuses" },
    ...Object.values(StatusEnum).map((value) => ({ value, label: value })),
  ];
  const priorityOptions = [
    { value: "", label: "All priorities" },
    ...Object.values(PriorityEnum).map((value) => ({ value, label: value })),
  ];
  const sortOptions = [
    { value: "createdAt", label: "Sort: created" },
    { value: "dueDate", label: "Sort: due date" },
    { value: "priority", label: "Sort: priority" },
    { value: "title", label: "Sort: title" },
  ];

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "44px",
      borderRadius: "0.75rem",
      borderColor: "rgba(71, 85, 105, 0.8)",
      backgroundColor: "rgba(2, 6, 23, 0.7)",
      boxShadow: "none",
    }),
    singleValue: (base: any) => ({ ...base, color: "#f8fafc" }),
    placeholder: (base: any) => ({ ...base, color: "#94a3b8" }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
          ? "rgba(79, 70, 229, 0.1)"
          : "rgba(15, 23, 42, 0.95)",
      color: "#f8fafc",
      cursor: "pointer",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      border: "1px solid rgba(71, 85, 105, 0.8)",
      borderRadius: "0.75rem",
      zIndex: 70,
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 70 }),
  };

  const selectedStatus =
    statusOptions.find((option) => option.value === (filters.status ?? "")) ||
    statusOptions[0];
  const selectedPriority =
    priorityOptions.find(
      (option) => option.value === (filters.priority ?? ""),
    ) || priorityOptions[0];
  const selectedSort =
    sortOptions.find(
      (option) => option.value === (filters.sortBy ?? "createdAt"),
    ) || sortOptions[0];
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(filters.status) ||
    Boolean(filters.priority) ||
    Boolean(filters.sortBy && filters.sortBy !== "createdAt") ||
    Boolean(filters.sortOrder && filters.sortOrder !== "desc");

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, dispatch]);

  const handleFilterChange = (key: string, value: string) => {
    dispatch(
      setFilters({
        [key]: value || undefined,
        page: 1,
      }),
    );
  };

  const handleCreate = async (formData: CreateTaskInput) => {
    try {
      await createTask.mutateAsync(formData);
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.refetchQueries({ queryKey: taskKeys.lists() });
      toast.success("Task created successfully");
      setShowCreateModal(false);
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    dispatch(resetFilters());
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">
              Task workspace
            </p>
            <h1 className="page-title">My tasks</h1>
            <p className="page-subtitle mt-2 text-slate-400">
              Plan your priorities, track progress, and keep your work moving.
            </p>
            {isFetching && !isLoading ? (
              <p className="mt-3 inline-flex items-center rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-sm text-slate-400">
                Updating tasks…
              </p>
            ) : null}
          </div>
          <Button onClick={() => setShowCreateModal(true)}>+ New task</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[180px]">
            <Select
              options={statusOptions}
              placeholder="All statuses"
              isSearchable={false}
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              value={selectedStatus}
              onChange={(selected) =>
                handleFilterChange("status", selected?.value || "")
              }
            />
          </div>
          <div className="w-full max-w-[180px]">
            <Select
              options={priorityOptions}
              placeholder="All priorities"
              isSearchable={false}
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              value={selectedPriority}
              onChange={(selected) =>
                handleFilterChange("priority", selected?.value || "")
              }
            />
          </div>
          <div className="w-full max-w-[180px]">
            <Select
              options={sortOptions}
              isSearchable={false}
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              value={selectedSort}
              onChange={(selected) =>
                handleFilterChange("sortBy", selected?.value || "createdAt")
              }
            />
          </div>
        </div>
      </Card>

      {hasActiveFilters ? (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 ml-auto hover:text-white"
          >
            Reset filters
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          role="status"
          aria-live="polite"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5"
            >
              <div className="h-5 w-3/4 rounded bg-slate-800" />
              <div className="mt-4 h-3 w-full rounded bg-slate-800/70" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-800/70" />
              <div className="mt-6 flex gap-2">
                <div className="h-7 w-20 rounded-full bg-slate-800" />
                <div className="h-7 w-24 rounded-full bg-slate-800" />
              </div>
            </div>
          ))}
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
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={setSelectedTask}
        />
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
