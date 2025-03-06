import { configureStore } from "@reduxjs/toolkit";
import { ThunkDispatch, thunk } from "redux-thunk";
import { Action } from "redux";
import apiEndpointsReducer from "./Redux/apiEndPoint";
import userReducer from "./Redux/userSlice";
import alertBackdropReducer from "./Redux/alertBackdropSlice";
import walletReducer from "./Redux/walletSlice"
import nftReducer from "./Redux/nftSlice"

const store = configureStore({
  reducer: {
    apiEndpoints: apiEndpointsReducer,
    user: userReducer,
    alertBackdrop: alertBackdropReducer,
    wallet: walletReducer,
    nft: nftReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// ✅ Correctly Type Dispatch to Support Thunk
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, Action>;

export const appDispatch: AppDispatch = store.dispatch;

import { TypedUseSelectorHook, useSelector } from 'react-redux';
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
