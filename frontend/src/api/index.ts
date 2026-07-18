import { apiClient } from "./client";
import type {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  Task,
  TaskQueryParams,
  TaskStats,
  User,
  CreateTaskInput,
  UpdateTaskInput,
} from "../types";

interface AuthSessionResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export const authApi = {
  register: async (data: RegisterCredentials) => {
    const response = await apiClient.post<ApiResponse<AuthSessionResponse>>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  login: async (data: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<AuthSessionResponse>>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  refresh: async () => {
    const response =
      await apiClient.post<ApiResponse<AuthSessionResponse>>("/auth/refresh");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response =
      await apiClient.get<ApiResponse<{ user: User }>>("/auth/profile");
    return response.data;
  },
};

export const taskApi = {
  getAll: async (params: TaskQueryParams = {}) => {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ task: Task }>>(
      `/tasks/${id}`,
    );
    return response.data;
  },

  create: async (data: CreateTaskInput) => {
    const response = await apiClient.post<ApiResponse<{ task: Task }>>(
      "/tasks",
      data,
    );
    return response.data;
  },

  update: async (id: string, data: UpdateTaskInput) => {
    const response = await apiClient.put<ApiResponse<{ task: Task }>>(
      `/tasks/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/tasks/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response =
      await apiClient.get<ApiResponse<{ stats: TaskStats }>>("/tasks/stats");
    return response.data;
  },
};
