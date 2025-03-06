import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { RootState } from "../store"; // Import RootState
import { setUser, activateUser, clearUser } from "./userSlice";
import { API } from "../Components/API/api";

// ✅ Define Thunk Type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;

export const logout = (): AppThunk => async (dispatch) => {
    try {
        await API.post("/auth/logout/");
    } catch (error) {
        console.error("Logout API failed:", error);
    }

    dispatch(activateUser(false));
    localStorage.clear();
    dispatch(clearUser());
};

export const checkAuth = (): AppThunk => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        console.log(token, userRole);

        if (!token || !userRole) {
            console.warn("No token or role found, logging out...");
            dispatch(logout());
            return;
        }

        const userRes = await API.get(`/auth/check/`, {
        });
        
        if (userRes.data.role === userRole) {
            console.log(userRes.data.first_name)
            dispatch(setUser(userRes.data));
            dispatch(activateUser(true));
        } else {
            console.warn("Role mismatch, logging out...");
            dispatch(logout());
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
        dispatch(activateUser(false));
    }
};
