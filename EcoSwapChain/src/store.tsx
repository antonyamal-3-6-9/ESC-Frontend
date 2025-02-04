import { configureStore } from "@reduxjs/toolkit";
import apiEndpointsReducer from "./Redux/apiEndPoint";  // Import the slice
import userReducer from "./Redux/userSlice";  // Import the slice
import alertBackdropReducer from "./Redux/alertBackdropSlice";  // Import the slice
import { checkAuth } from "./Redux/userActions";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: {
    apiEndpoints: apiEndpointsReducer, 
    user: userReducer, // Add the reducer to the store
    alertBackdrop: alertBackdropReducer, // Add the reducer to the store
  }, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

store.dispatch(checkAuth());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
