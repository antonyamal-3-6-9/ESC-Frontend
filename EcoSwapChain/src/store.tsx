import { configureStore } from "@reduxjs/toolkit";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import apiEndpointsReducer from "./Redux/apiEndPoint";
import userReducer from "./Redux/userSlice";
import alertBackdropReducer from "./Redux/alertBackdropSlice";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: {
    apiEndpoints: apiEndpointsReducer,
    user: userReducer,
    alertBackdrop: alertBackdropReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// ✅ Correctly Type Dispatch to Support Thunks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, Action>;

export const appDispatch: AppDispatch = store.dispatch;

export default store;
