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

export const fetchProducts = (): AppThunk => async (dispatch) => {

    try {
        const response = await PublicAPI.get('/nfts/list/all/');
        console.log(response)
        dispatch(addProduct(response.data.nfts));
    } catch (error) {
        console.log(error)
    }
};