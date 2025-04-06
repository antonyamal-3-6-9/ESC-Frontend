import { Alert, Snackbar, IconButton, Slide, Grow, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setAlertOn } from "../../Redux/alertBackdropSlice";
import { styled } from "@mui/material/styles";

const CollapsibleAlert = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const alertData = useSelector((state: RootState) => state.alertBackdrop.alert);

  const severityColorMap = {
    error: theme.palette.secondary.main,
    warning: theme.palette.primary.main,
    info: theme.palette.accent.main,
    success: theme.palette.accent.light,
  };

  const AlertIcon = styled('div')({
    display: 'flex',
    paddingRight: '8px',
    '& svg': {
      fontSize: '1.5rem',
      color: theme.palette.background.default,
    }
  });

  const StyledAlert = styled(Alert)(({ severity }) => ({
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(46, 80, 119, 0.15)',
    transition: 'transform 0.3s, opacity 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    backgroundColor: severityColorMap[severity as keyof typeof severityColorMap] || theme.palette.accent.main,
    color: theme.palette.background.default,
    fontWeight: 500,
    padding: theme.spacing(1.5),
    alignItems: 'center',
  }));

  const getIcon = (severity: string): JSX.Element => {
    const iconStyle = { color: theme.palette.background.default };
    switch (severity) {
      case "error": return <ErrorIcon sx={iconStyle} />;
      case "warning": return <WarningIcon sx={iconStyle} />;
      case "info": return <InfoIcon sx={iconStyle} />;
      case "success": return <CheckCircleIcon sx={iconStyle} />;
      default: return <InfoIcon sx={iconStyle} />;
    }
  };

  const handleClose = () => dispatch(setAlertOn(false));

  return (
    <Snackbar
      key = { alertData.alertMessage + alertData.alertSeverity }
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={alertData.alertOn}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionComponent={(props) => (
        <Slide {...props} direction="down" timeout={200} />
      )}
      TransitionProps={{ timeout: 200 }}
    >
      <StyledAlert
        elevation={6}
        onClose={handleClose}
        severity={alertData.alertSeverity}
        icon={
          <AlertIcon>
            {getIcon(alertData.alertSeverity)}
          </AlertIcon>
        }
        action={
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: theme.palette.background.default,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Grow in={alertData.alertOn} timeout={500}>
          <span style={{color: "black"}} >{alertData.alertMessage}</span>
        </Grow>
      </StyledAlert>
    </Snackbar>
  );
};

export default CollapsibleAlert;