import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { TaskFormData, TaskFormProps } from "../types";
import {
  TaskStatus as StatusEnum,
  TaskPriority as PriorityEnum,
} from "../types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const statusOptions = Object.values(StatusEnum).map((value) => ({
  value,
  label: value,
}));

const priorityOptions = Object.values(PriorityEnum).map((value) => ({
  value,
  label: value,
}));

const selectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "44px",
    backgroundColor: "rgba(2, 6, 23, 0.7)",
    borderColor: "rgba(71, 85, 105, 0.8)",
    borderRadius: "0.75rem",
    boxShadow: "none",
    fontSize: "0.95rem",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      borderColor: "#818cf8",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 0.75rem",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#f8fafc",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8",
  }),
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
  }),
  menuList: (base: any) => ({
    ...base,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
  }),
};

const formatDateValue = (date: Date | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
    control,
    watch,
    setError,
    clearErrors: clearFormErrors,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    mode: "onBlur",
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

  const startDate = watch("startDate");
  const dueDate = watch("dueDate");

  const dateError = useMemo(() => {
    if (!startDate || !dueDate) return "";
    const start = new Date(`${startDate}T00:00:00`);
    const due = new Date(`${dueDate}T00:00:00`);
    return start > due ? "Due date must be on or after the start date." : "";
  }, [startDate, dueDate]);

  useEffect(() => {
    clearFormErrors();
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
    } else {
      reset({
        title: "",
        description: "",
        status: StatusEnum.TODO,
        priority: PriorityEnum.MEDIUM,
        startDate: "",
        dueDate: "",
        estimatedHours: 0,
        tagsInput: "",
      });
    }
  }, [task, reset, clearFormErrors]);

  useEffect(() => {
    if (dateError) {
      setError("dueDate", { type: "manual", message: dateError });
    } else {
      clearErrors("dueDate");
    }
  }, [dateError, setError, clearErrors]);

  const handleFormSubmit = (data: TaskFormData) => {
    clearFormErrors();
    if (dateError) {
      setError("dueDate", { type: "manual", message: dateError });
      return;
    }
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div>
        <label className="label-text" htmlFor="title">
          Title <span className="text-rose-400">*</span>
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
          className="w-full min-h-[112px] rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          rows={4}
          {...register("description")}
        />
      </div>

      <div className="form-grid two-col">
        <div>
          <label className="label-text" htmlFor="status">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                inputId="status"
                options={statusOptions}
                value={
                  statusOptions.find(
                    (option) => option.value === field.value,
                  ) || null
                }
                onChange={(selected) =>
                  field.onChange(selected?.value ?? StatusEnum.TODO)
                }
                onBlur={field.onBlur}
                styles={selectStyles}
                classNamePrefix="task-select"
                placeholder="Select status"
                isSearchable={false}
              />
            )}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="priority">
            Priority
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                inputId="priority"
                options={priorityOptions}
                value={
                  priorityOptions.find(
                    (option) => option.value === field.value,
                  ) || null
                }
                onChange={(selected) =>
                  field.onChange(selected?.value ?? PriorityEnum.MEDIUM)
                }
                onBlur={field.onBlur}
                styles={selectStyles}
                classNamePrefix="task-select"
                placeholder="Select priority"
                isSearchable={false}
              />
            )}
          />
        </div>
      </div>

      <div className="form-grid two-col">
        <div>
          <label className="label-text" htmlFor="startDate">
            Start date
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="startDate"
                selected={
                  field.value ? new Date(`${field.value}T12:00:00`) : null
                }
                onChange={(date: Date | null) =>
                  field.onChange(formatDateValue(date))
                }
                dateFormat="MMM d, yyyy"
                placeholderText="Select start date"
                calendarClassName="!rounded-2xl !border-slate-700 !bg-slate-900 !text-slate-100"
                popperClassName="z-[60]"
                customInput={<Input error={Boolean(errors.startDate)} />}
              />
            )}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="dueDate">
            Due date
          </label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="dueDate"
                selected={
                  field.value ? new Date(`${field.value}T12:00:00`) : null
                }
                onChange={(date: Date | null) =>
                  field.onChange(formatDateValue(date))
                }
                dateFormat="MMM d, yyyy"
                placeholderText="Select due date"
                calendarClassName="!rounded-2xl !border-slate-700 !bg-slate-900 !text-slate-100"
                popperClassName="z-[60]"
                customInput={
                  <Input error={Boolean(errors.dueDate || dateError)} />
                }
              />
            )}
          />
          {errors.dueDate ? (
            <p className="helper-text">{errors.dueDate.message}</p>
          ) : dateError ? (
            <p className="helper-text">{dateError}</p>
          ) : null}
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
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting
            ? "Saving..."
            : task
              ? "Update task"
              : "Create task"}
        </Button>
      </div>
    </form>
  );
}
