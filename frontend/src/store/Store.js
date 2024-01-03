import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { managementApi } from "../service/service";
// import { toastReducer } from "./tostify";
export const store = configureStore({
  reducer: {
    // toaster: toastReducer,
    [managementApi.reducerPath]: managementApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([managementApi.middleware]),
});

setupListeners(store.dispatch);
