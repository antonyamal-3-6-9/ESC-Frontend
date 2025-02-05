import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { setUser, activateUser, clearUser } from './userSlice';
import { API } from '../Components/API/api';

// ✅ Define the Thunk Dispatch Type
export type AppThunk = (dispatch: ThunkDispatch<{}, {}, Action>) => Promise<void>;

export const logout = (): AppThunk => async (dispatch) => {
    try {
        await API.post('/auth/logout');
    } catch (error) {
        console.error("Logout API failed:", error);
    }

    dispatch(activateUser(false));
    localStorage.clear();
    dispatch(clearUser());
};

export const checkAuth = (): AppThunk => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (!token || !userRole) {
            console.warn("No token or role found, logging out...");
            await dispatch(logout());  // ✅ No more TypeScript errors
            return;
        }

        const userRes = await API.get(`/auth/check/${userRole}/`);

        if (userRes.data.role === userRole) {
            dispatch(setUser(userRes.data.user));
            dispatch(activateUser(true));
        } else {
            console.warn("Role mismatch, logging out...");
            await dispatch(logout());  // ✅ Correctly handled thunk
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
        dispatch(activateUser(false));
    }
};
