import {
    setAlertMessage,
    setAlertOn,
    setAlertSeverity,
  } from "../../Redux/alertBackdropSlice";
import { appDispatch } from "../../store";

// 🔹 **Helper Function to Dispatch Alert Actions**
export const dispatchAlert = (message: string, severity: "error" | "warning" | "info" | "success") => {
    appDispatch(setAlertOn(true));
    appDispatch(setAlertMessage(message));
    appDispatch(setAlertSeverity(severity));
};