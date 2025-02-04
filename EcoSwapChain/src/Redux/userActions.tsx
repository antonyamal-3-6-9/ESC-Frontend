// actions/authActions.js
import axios from 'axios';
import { setUser, activateUser } from './userSlice';
import { Dispatch } from 'redux';

export const checkAuth = () => async (dispatch: Dispatch) => {
    let userRole
    try{
        localStorage.getItem('token')
        userRole = localStorage.getItem('role')
    } catch (error){
        dispatch(activateUser(false))
    }

    try {
        const userRes = await axios.get('http://localhost:5000/auth/user');
        if (userRes.data.role === userRole) {
            dispatch(setUser(userRes.data))
            dispatch(activateUser(true))
        } else {
            dispatch(activateUser(false))
            localStorage.clear()
        }
    } catch (error) {
        dispatch(activateUser(false))
    }
}
