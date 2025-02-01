import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setAlertOn } from "../../Redux/alertBackdropSlice";


const CollapsibleAlert = ({

}) => {
  // Customize colors based on severity
  const getColor = (severity: string): string => {
    switch (severity) {
      case "error":
        return "#d32f2f"; // Red
      case "warning":
        return "#ed6c02"; // Orange
      case "info":
        return "#0288d1"; // Blue
      case "success":
        return "#2e7d32"; // Green
      default:
        return "#0288d1"; // Default to blue
    }
  };

  // Get the appropriate icon based on severity
  const getIcon = (severity: string): JSX.Element => {
    switch (severity) {
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      case "info":
        return <InfoIcon />;
      case "success":
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const alertData = useSelector((state: RootState) => state.alertBackdrop.alert); // Get the alert state from the store
  const dispatch = useDispatch();
  
  const handleClose = () => {
    dispatch(setAlertOn(false)); // Close the alert
  }

  return (
    <Collapse in={alertData.alertOn}>
      <Alert
        severity={alertData.alertSeverity}
        icon={getIcon(alertData.alertSeverity)}
        sx={{
          backgroundColor: getColor(alertData.alertSeverity),
          color: "#fff",
          "& .MuiAlert-icon": {
            color: "#fff",
          },
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {alertData.alertMessage}
      </Alert>
    </Collapse>
  );
};

export default CollapsibleAlert;
