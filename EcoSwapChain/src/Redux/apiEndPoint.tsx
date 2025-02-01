import { createSlice } from "@reduxjs/toolkit";

interface ApiEndpointsState {
  traderApi: string;
  otpApi: string;
  orderApi: string;
}
// Initial state for API endpoints
const initialState: ApiEndpointsState = {
  traderApi: "http://127.0.0.1:8000/trader/",
  otpApi: "http://127.0.0.1:8000/verification/",
  orderApi: "https://api.example.com/orders",
};

// Creating the slice
const apiEndpointsSlice = createSlice({
  name: "apiEndpoints",
  initialState,
  reducers: {
    setUserApi: (state, action) => {
      state.traderApi = action.payload;
    },
    setProductApi: (state, action) => {
      state.otpApi = action.payload;
    },
    setOrderApi: (state, action) => {
      state.orderApi = action.payload;
    },
  },
});

export const { setUserApi, setProductApi, setOrderApi } = apiEndpointsSlice.actions;

export default apiEndpointsSlice.reducer;
