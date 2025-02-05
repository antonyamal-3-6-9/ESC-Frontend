import { TextField, Button, Box, CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Import Grid2
import Container from "@mui/material/Container"; // Ensure correct import of Container
import { useState } from "react";
import { Google } from "@mui/icons-material";
import RImg from "./RImg.jpg";
import Navbar from "../NavBar/Navbar";
import { PublicAPI } from "../API/api"
import { useDispatch } from "react-redux";
import OTPModal from "./OTPModal";
import BackDrop from "../Backdrop/Backdrop";
import CollapsibleAlert from "../Alert/Alert";
import {
  setAlertOn,
  setAlertSeverity,
  setAlertMessage,
} from "../../Redux/alertBackdropSlice";
import { setLoading } from "../../Redux/alertBackdropSlice";
import { setUser, activateUser } from "../../Redux/userSlice";

const Register = () => {

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const registerResponse = await PublicAPI.post(
        `trader/register/`,
        {
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
        }
      );
      localStorage.setItem("token", registerResponse.data.token);
      dispatch(setUser(registerResponse.data.user));
      dispatch(activateUser(true));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  const handleOtpCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      await PublicAPI.post(`verification/create/`, {
        email: registerData.email,
      });
      setOpen(true);
      dispatch(setLoading(false));
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("info"));
      dispatch(setAlertMessage("OTP sent to email"));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      dispatch(setLoading(true));
      await PublicAPI.post(`verification/verify/`, {
        email: registerData.email,
        otp: otp,
      });
      setOpen(false);
      dispatch(setLoading(false));
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("success"));
      dispatch(setAlertMessage("OTP verified"));
      handleSubmit();
    } catch (error) {
      console.log(error);
       dispatch(setLoading(false));
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("error"));
      dispatch(setAlertMessage("Error verifying OTP"));
    }
  };

  return (
    <>
      <Navbar />
      <BackDrop>
        <CircularProgress color="inherit" />
      </BackDrop>
      <CollapsibleAlert />
      <OTPModal
        open={open}
        handleClose={() => {
          setOpen(false), setOtp("");
        }}
        handleSubmit={handleOtpSubmit}
        otp={otp}
        setOtp={setOtp}
      />
      <Container
        maxWidth={"md"}
        disableGutters
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6F4F0", // Light background
          marginTop: 12,
        }}
      >
        <Grid2 container>
          {/* Left Side - Image */}
          <Grid2 size={7}>
            <Box
              sx={{
                height: "80vh",
                backgroundImage: `url("${RImg}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0 20px",
                position: "relative",
              }}
            />
          </Grid2>
          {/* Right Side - Register Form */}
          <Grid2
            size={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "400px",
                padding: 4,
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleOtpCreate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* First Name */}
                <TextField
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                  value={registerData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "#4DA1A9" }, // Label color
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#79D7BE" }, // Border color
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />

                {/* Last Name */}
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="lastName"
                  value={registerData.lastName}
                  onChange={handleChange}
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "#4DA1A9" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#79D7BE" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />

                {/* Email */}
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={registerData.email}
                  onChange={handleChange}
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "#4DA1A9" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#79D7BE" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />

                <TextField
                  label="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "#4DA1A9" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#79D7BE" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />

                {/* Register Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#2E5077",
                    color: "#F6F4F0",
                    "&:hover": {
                      backgroundColor: "#4DA1A9",
                    },
                  }}
                >
                  Register
                </Button>

                {/* Google OAuth Button */}
                <Button
                  variant="outlined"
                  startIcon={<Google />}
                  fullWidth
                  sx={{
                    color: "#2E5077",
                    borderColor: "#79D7BE",
                    "&:hover": {
                      borderColor: "#4DA1A9",
                      backgroundColor: "#F6F4F0",
                    },
                  }}
                >
                  Sign in with Google
                </Button>
              </form>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
};

export default Register;
