import { configureStore } from "@reduxjs/toolkit";
import { authSlice, taskFilterSlice } from "./index";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    taskFilters: taskFilterSlice.reducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
