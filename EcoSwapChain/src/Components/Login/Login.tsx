import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import { Google } from "@mui/icons-material";
import LImg from "./LImg.jpg";
import { useState } from "react";
import { activateUser, setUser } from "../../Redux/userSlice";
import { setLoading, setAlertMessage, setAlertOn, setAlertSeverity } from "../../Redux/alertBackdropSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { PublicAPI } from "../API/api";
import CollapsibleAlert from "../Alert/Alert";
import BackDrop from "../Backdrop/Backdrop";
import { useParams } from "react-router";

interface LoginData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const { role } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Email validation
    if (!loginData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email address is invalid";
      isValid = false;
    }

    // Password validation
    if (!loginData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (loginData.password.length < 3) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const loginResponse = await PublicAPI.post(`/${role}/login/`, {
        email: loginData.email,
        password: loginData.password,
      });

      dispatch(activateUser(true));
      dispatch(setUser(loginResponse.data.user));
      localStorage.setItem("token", loginResponse.data.token);

      // Show success message
      dispatch(setAlertOn(true));
      dispatch(setAlertMessage("Login successful!"));
      dispatch(setAlertSeverity("success"));

      // Navigate based on role
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard/");
        } else if (role === "trader") {
          navigate("/");
        }
      }, 500)

    } catch (error) {
      console.error("Login failed.", error);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  return (
    <>
      <BackDrop>
        <CircularProgress color="inherit" />
      </BackDrop>
      <CollapsibleAlert />
      <Container
        maxWidth={"md"}
        disableGutters
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6F4F0",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#2E5077",
            textAlign: "center",
          }}
        >
          SIGN IN
        </Typography>
        <Grid2 container>
          {/* Left Side - Image */}
          <Grid2 size={6}>
            <Box
              sx={{
                height: { xs: "40vh", md: "80vh" },
                backgroundImage: `url("${LImg}")`,
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

          {/* Right Side - Login Form */}
          <Grid2 size={6}>
            <Box
              sx={{
                width: "100%",
                maxWidth: "400px",
                padding: 4,
                borderRadius: "10px",
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Email */}
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={loginData.email}
                  name="email"
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                  slotProps={{
                    inputLabel: {
                      style: { color: errors.email ? "#d32f2f" : "#4DA1A9" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: errors.email ? "#d32f2f" : "#79D7BE"
                      },
                      "&:hover fieldset": {
                        borderColor: errors.email ? "#d32f2f" : "#4DA1A9"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: errors.email ? "#d32f2f" : "#4DA1A9"
                      },
                    },
                  }}
                />

                {/* Password */}
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={loginData.password}
                  name="password"
                  onChange={handleChange}
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={isSubmitting}
                  slotProps={{
                    inputLabel: {
                      style: { color: errors.password ? "#d32f2f" : "#4DA1A9" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: errors.password ? "#d32f2f" : "#79D7BE"
                      },
                      "&:hover fieldset": {
                        borderColor: errors.password ? "#d32f2f" : "#4DA1A9"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: errors.password ? "#d32f2f" : "#4DA1A9"
                      },
                    },
                  }}
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#2E5077",
                    color: "#F6F4F0",
                    "&:hover": {
                      backgroundColor: "#4DA1A9",
                    },
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                {/* Google OAuth Button */}
                <Button
                  variant="outlined"
                  startIcon={<Google />}
                  fullWidth
                  disabled={isSubmitting}
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

export default Login;