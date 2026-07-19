import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, TaskQueryParams } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface TaskFilterState {
  filters: TaskQueryParams;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialAuthState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const initialFilterState: TaskFilterState = {
  filters: {
    page: 1,
    limit: 9,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.accessToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const taskFilterSlice = createSlice({
  name: "taskFilters",
  initialState: initialFilterState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TaskQueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilterState.filters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, updateUser } =
  authSlice.actions;
export const { setFilters, resetFilters, setPage } = taskFilterSlice.actions;

export type RootState = {
  auth: AuthState;
  taskFilters: TaskFilterState;
};
