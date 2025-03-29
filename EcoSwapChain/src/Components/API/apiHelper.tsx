import {
  setAlertMessage,
  setAlertOn,
  setAlertSeverity
} from '../../Redux/alertBackdropSlice'
import store from '../../store'

// 🔹 **Helper Function to Dispatch Alert Actions**

export const dispatchAlert = (
  message: string,
  severity: 'error' | 'warning' | 'info' | 'success'
) => {
  console.log('An error is executing')
  store.dispatch(setAlertOn(true))
  store.dispatch(setAlertMessage(message))
  store.dispatch(setAlertSeverity(severity))
}
