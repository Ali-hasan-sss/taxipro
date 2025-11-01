import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./slices/driversSlice";
import ordersReducer from "./slices/ordersSlice";
import authReducer from "./slices/authSlice";
import settingsReducer from "./slices/settingsSlice";

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    orders: ordersReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
