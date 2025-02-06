import { createSlice } from "@reduxjs/toolkit";

interface AlertBackdropProps {
  loading: boolean;
  alert: {
    alertOn: boolean;
    alertMessage: string;
    alertSeverity: "error" | "warning" | "info" | "success";
  };
}

const initialState: AlertBackdropProps = {
  loading: false,
  alert: {
    alertOn: false,
    alertMessage: "",
    alertSeverity: "info",
  },
};

const alertBackdropSlice = createSlice({
  name: "alertBackdrop",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAlertOn: (state, action) => {
      state.alert.alertOn = action.payload; // Set only alertOn
    },
    setAlertMessage: (state, action) => {
      state.alert.alertMessage = action.payload; // Set only alertMessage
    },
    setAlertSeverity: (state, action) => {
      state.alert.alertSeverity = action.payload; // Set only alertSeverity
  },
}
});

// Export actions
export const { setLoading, setAlertOn, setAlertMessage, setAlertSeverity } = alertBackdropSlice.actions;

// Export reducer
export default alertBackdropSlice.reducer;
