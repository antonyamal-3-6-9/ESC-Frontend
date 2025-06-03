import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  Fade,
  Slide
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import { Google } from "@mui/icons-material";
import LImg from "./LImg.jpg";
import { useState, useEffect } from "react";
import { activateUser, setUser, clearUser } from "../../Redux/userSlice";
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
  const theme = useTheme();

  // Enhanced responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:400px)');

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(clearUser())
  }, [])

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

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6F4F0",
          background: {
            xs: `linear-gradient(135deg, #F6F4F0 0%, #e8e4df 100%)`,
            md: "#F6F4F0"
          },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Mobile header */}
        {isMobile && (
          <Fade in timeout={800}>
            <Box
              sx={{
                textAlign: "center",
                pt: { xs: 4, sm: 6 },
                pb: { xs: 2, sm: 3 },
                px: 2,
                position: 'relative',
                zIndex: 2
              }}
            >
              <Typography
                variant={isExtraSmall ? "h5" : "h4"}
                gutterBottom
                sx={{
                  color: "#2E5077",
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: { xs: 1, sm: 2 },
                  fontSize: {
                    xs: isExtraSmall ? '1.5rem' : '1.8rem',
                    sm: '2.1rem'
                  }
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4DA1A9",
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  opacity: 0.8
                }}
              >
                Sign in to continue to your account
              </Typography>
            </Box>
          </Fade>
        )}

        <Container
          maxWidth={isMobile ? false : "lg"}
          disableGutters={isMobile}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            px: { xs: 0, md: 2 },
            py: { xs: 0, md: 4 }
          }}
        >
          {/* Desktop title */}
          {!isMobile && (
            <Fade in timeout={600}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  color: "#2E5077",
                  textAlign: "center",
                  position: 'absolute',
                  top: { md: 40, lg: 30 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontWeight: 800,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  fontSize: { md: '2.5rem', lg: '3rem' },
                }}
              >
                Sign In
              </Typography>
            </Fade>
          )}

          <Paper
            elevation={isMobile ? 0 : 8}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: '900px', lg: '1000px' },
              mx: 'auto',
              borderRadius: { xs: 0, md: 4 },
              overflow: 'hidden',
              backgroundColor: { xs: 'transparent', md: 'white' },
              backdropFilter: { md: 'blur(10px)' },
              border: { md: '1px solid rgba(255,255,255,0.2)' }
            }}
          >
            <Grid2 container sx={{ minHeight: { md: '500px', lg: '600px' } }}>
              {/* Image Section - Hidden on mobile, adaptive on larger screens */}
              {!isMobile && (
                <Grid2 size={{ md: 6, lg: 5 }}>
                  <Slide direction="right" in timeout={1000}>
                    <Box
                      sx={{
                        height: '100%',
                        minHeight: { md: '500px', lg: '600px' },
                        backgroundImage: `url("${LImg}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(46,80,119,0.3) 0%, rgba(77,161,169,0.2) 100%)',
                          zIndex: 1
                        }
                      }}
                    />
                  </Slide>
                </Grid2>
              )}

              {/* Form Section */}
              <Grid2 size={{ xs: 12, md: 6, lg: 7 }}>
                <Slide direction={isMobile ? "up" : "left"} in timeout={800}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: {
                        xs: 3,
                        sm: 4,
                        md: 5,
                        lg: 6
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: {
                          xs: isExtraSmall ? '280px' : '360px',
                          sm: '400px',
                          md: '380px',
                          lg: '420px'
                        }
                      }}
                    >
                      {/* Desktop form title */}
                      {!isMobile && (
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#2E5077",
                            textAlign: "center",
                            mb: 4,
                            fontWeight: 600,
                            fontSize: { md: '1.8rem', lg: '2.1rem' }
                          }}
                        >
                          Welcome Back
                        </Typography>
                      )}

                      {/* Mobile background card */}
                      <Paper
                        elevation={isMobile ? 2 : 0}
                        sx={{
                          backgroundColor: isMobile ? 'rgba(255,255,255,0.95)' : 'transparent',
                          backdropFilter: isMobile ? 'blur(10px)' : 'none',
                          borderRadius: { xs: 3, sm: 4 },
                          p: { xs: 3, sm: 4, md: 0 },
                          border: isMobile ? '1px solid rgba(121,215,190,0.3)' : 'none'
                        }}
                      >
                        <form
                          noValidate
                          autoComplete="off"
                          onSubmit={handleSubmit}
                        >
                          <Stack spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
                            {/* Email Field */}
                            <TextField
                              label="Email Address"
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
                              size={isSmallMobile ? "small" : "medium"}
                              slotProps={{
                                inputLabel: {
                                  style: {
                                    color: errors.email ? "#d32f2f" : "#4DA1A9",
                                    fontSize: isSmallMobile ? '0.85rem' : '1rem'
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  fontSize: { xs: '0.9rem', sm: '1rem' },
                                  "& fieldset": {
                                    borderColor: errors.email ? "#d32f2f" : "#79D7BE",
                                    borderWidth: 2
                                  },
                                  "&:hover fieldset": {
                                    borderColor: errors.email ? "#d32f2f" : "#4DA1A9"
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: errors.email ? "#d32f2f" : "#4DA1A9"
                                  },
                                },
                                "& .MuiFormHelperText-root": {
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }
                              }}
                            />

                            {/* Password Field */}
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
                              size={isSmallMobile ? "small" : "medium"}
                              slotProps={{
                                inputLabel: {
                                  style: {
                                    color: errors.password ? "#d32f2f" : "#4DA1A9",
                                    fontSize: isSmallMobile ? '0.85rem' : '1rem'
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  fontSize: { xs: '0.9rem', sm: '1rem' },
                                  "& fieldset": {
                                    borderColor: errors.password ? "#d32f2f" : "#79D7BE",
                                    borderWidth: 2
                                  },
                                  "&:hover fieldset": {
                                    borderColor: errors.password ? "#d32f2f" : "#4DA1A9"
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: errors.password ? "#d32f2f" : "#4DA1A9"
                                  },
                                },
                                "& .MuiFormHelperText-root": {
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }
                              }}
                            />

                            {/* Login Button */}
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              disabled={isSubmitting}
                              size={isSmallMobile ? "medium" : "large"}
                              sx={{
                                backgroundColor: "#2E5077",
                                color: "#F6F4F0",
                                borderRadius: 2,
                                py: { xs: 1.2, sm: 1.5, md: 1.8 },
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(46,80,119,0.3)',
                                transition: 'all 0.3s ease',
                                "&:hover": {
                                  backgroundColor: "#4DA1A9",
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 6px 20px rgba(77,161,169,0.4)'
                                },
                                "&:disabled": {
                                  backgroundColor: "#ccc",
                                  transform: 'none',
                                  boxShadow: 'none'
                                }
                              }}
                            >
                              {isSubmitting ? (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <CircularProgress size={16} color="inherit" />
                                  <span>Signing in...</span>
                                </Stack>
                              ) : (
                                "Sign In"
                              )}
                            </Button>

                            {/* Divider */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: { xs: 1, sm: 2 }
                              }}
                            >
                              <Box sx={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  px: 2,
                                  color: '#666',
                                  fontSize: { xs: '0.8rem', sm: '0.85rem' }
                                }}
                              >
                                or
                              </Typography>
                              <Box sx={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
                            </Box>

                            {/* Google OAuth Button */}
                            <Button
                              variant="outlined"
                              startIcon={<Google sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />}
                              fullWidth
                              disabled={isSubmitting}
                              size={isSmallMobile ? "medium" : "large"}
                              sx={{
                                color: "#2E5077",
                                borderColor: "#79D7BE",
                                borderWidth: 2,
                                borderRadius: 2,
                                py: { xs: 1.2, sm: 1.5, md: 1.8 },
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                fontWeight: 500,
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                "&:hover": {
                                  borderColor: "#4DA1A9",
                                  backgroundColor: "rgba(121,215,190,0.1)",
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(121,215,190,0.2)'
                                },
                              }}
                            >
                              Continue with Google
                            </Button>
                          </Stack>
                        </form>
                      </Paper>
                    </Box>
                  </Box>
                </Slide>
              </Grid2>
            </Grid2>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;