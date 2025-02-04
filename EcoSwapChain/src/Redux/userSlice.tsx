import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  email: string | null;
  role: string | null;
  active: boolean;
}


// Initial state for the user
const initialState: UserState = {
  username: null,
  email: null,
  role: null,
  active: false,
};

// Create slice to handle user data
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = `${action.payload.first_name} ${action.payload.last_name}`;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    activateUser: (state, action) => {
      state.active = action.payload;
    },
    clearUser: (state) => {
      state.username = null;
      state.email = null;
      state.role = null;
    },
  },
});

// Export the actions
export const { setUser, clearUser, activateUser } = userSlice.actions;

export default userSlice.reducer;
