import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  role: string | null;
  active: boolean;
  id: number;
}


// Initial state for the user
const initialState: UserState = {
  username: null,
  role: null,
  active: false,
  id: 0,
};

// Create slice to handle user data
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.id = action.payload.id
      localStorage.setItem('role', action.payload.role)
    },
    activateUser: (state, action) => {
      state.active = action.payload;
    },
    clearUser: (state) => {
      state.username = null;
      state.role = null;
    },
  },
});

// Export the actions
export const { setUser, clearUser, activateUser } = userSlice.actions;

export default userSlice.reducer;
