import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Task, CreateTaskInput } from "../types";
import {
  TaskStatus as StatusEnum,
  TaskPriority as PriorityEnum,
} from "../types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface TaskFormData extends CreateTaskInput {
  tagsInput?: string;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<TaskFormData>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      status: StatusEnum.TODO,
      priority: PriorityEnum.MEDIUM,
      estimatedHours: 0,
      tagsInput: "",
    },
  });

  useEffect(() => {
    clearErrors();
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate?.split("T")[0],
        dueDate: task.dueDate?.split("T")[0],
        estimatedHours: task.estimatedHours,
        tagsInput: task.tags.join(", "),
      });
    }
  }, [task, reset, clearErrors]);

  const handleFormSubmit = (data: TaskFormData) => {
    clearErrors();
    const tags = data.tagsInput
      ? data.tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    onSubmit({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate || undefined,
      dueDate: data.dueDate || undefined,
      estimatedHours: Number(data.estimatedHours) || 0,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="label-text" htmlFor="title">
          Title *
        </label>
        <Input
          id="title"
          error={Boolean(errors.title)}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <p className="helper-text">{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label className="label-text" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="input-field min-h-[100px]"
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="form-grid two-col">
        <div>
          <label className="label-text" htmlFor="status">
            Status
          </label>
          <select id="status" className="input-field" {...register("status")}>
            {Object.values(StatusEnum).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            className="input-field"
            {...register("priority")}
          >
            {Object.values(PriorityEnum).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid two-col">
        <div>
          <label className="label-text" htmlFor="startDate">
            Start date
          </label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>

        <div>
          <label className="label-text" htmlFor="dueDate">
            Due date
          </label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
      </div>

      <div className="form-grid two-col">
        <div>
          <label className="label-text" htmlFor="estimatedHours">
            Estimated hours
          </label>
          <Input
            id="estimatedHours"
            type="number"
            min={0}
            step={0.5}
            {...register("estimatedHours")}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="tagsInput">
            Tags (comma separated)
          </label>
          <Input
            id="tagsInput"
            placeholder="work, urgent"
            {...register("tagsInput")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : task ? "Update task" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
