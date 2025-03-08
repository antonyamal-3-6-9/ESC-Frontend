import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { RootState } from "../store"; // Import RootState
import { addProduct } from "./nftSlice";
import { PublicAPI } from "../Components/API/api";

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action
>;

