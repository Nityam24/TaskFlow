import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api";
import type {
  TaskQueryParams,
  CreateTaskInput,
  UpdateTaskInput,
  Task,
} from "../types";
import { useAppSelector } from "../store/hooks";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: TaskQueryParams) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, "stats"] as const,
};

export function useTasks() {
  const filters = useAppSelector((state) => state.taskFilters.filters);

  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: taskKeys.detail(id || ""),
    queryFn: () => taskApi.getById(id!),
    enabled: !!id,
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => taskApi.getStats(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousQueries = queryClient.getQueriesData<{ data?: Task[] }>({
        queryKey: taskKeys.lists(),
      });

      queryClient.setQueriesData<{ data?: Task[]; success?: boolean }>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((task) =>
              task._id === id ? { ...task, ...data } : task,
            ),
          };
        },
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousQueries = queryClient.getQueriesData<{ data?: Task[] }>({
        queryKey: taskKeys.lists(),
      });

      queryClient.setQueriesData<{ data?: Task[] }>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((task) => task._id !== id),
          };
        },
      );

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}
