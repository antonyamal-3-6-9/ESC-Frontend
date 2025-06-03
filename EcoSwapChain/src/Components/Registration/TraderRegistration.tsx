import { TextField, Button, Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Google } from "@mui/icons-material";
import { motion } from "framer-motion";
import { PublicAPI } from "../API/api";
import { useDispatch } from "react-redux";
import OTPModal from "./OTPModal";
import {
  setAlertOn,
  setAlertSeverity,
  setAlertMessage,
  setLoading
} from "../../Redux/alertBackdropSlice";
import { setUser, activateUser } from "../../Redux/userSlice";
import KeyModal from "./KeyModal";
import { create } from "./walletInitialization";
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NatureIcon from '@mui/icons-material/Nature';

interface Wallet {
  pubKey: string;
  passKey: string;
  status: boolean;
}

interface Trader {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const dispatch = useDispatch();


  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  const [registerData, setRegisterData] = useState<Trader>({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [walletData, setWalletData] = useState<Wallet>({
    pubKey: "",
    passKey: "",
    status: false
  });

  const [errors, setErrors] = useState<Partial<{
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>>({});

  // Platform features for animation
  const features = [
    {
      title: "Secure Authentication",
      description: "NFT-backed authentication ensures genuine products",
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: "#4DA1A9" }} />
    },
    {
      title: "Complete Anonymity",
      description: "Privacy-focused transactions protect your identity",
      icon: <LockIcon sx={{ fontSize: 40, color: "#4DA1A9" }} />
    },
    {
      title: "Verified Shipping",
      description: "Platform-specific shipping guarantees authenticity",
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#4DA1A9" }} />
    },
    {
      title: "Crypto Payments",
      description: "Simple anonymous payments with platform-specific crypto",
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: "#4DA1A9" }} />
    },
    {
      title: "Sustainability Rewards",
      description: "Earn carbon credits for trading sustainable products",
      icon: <NatureIcon sx={{ fontSize: 40, color: "#4DA1A9" }} />
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const activateWallet = async () => {
    try {
      const wallet = await create();
      if (!wallet.status) {
        return false;
      } else {
        setWalletData((prev) => ({
          ...prev,
          pubKey: wallet.pubKey,
          passKey: wallet.passKey,
          status: wallet.status
        }));
        return true;
      }
    } catch (error) {
      console.error("Error activating wallet:", error);
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Partial<{
      userName: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }> = {};

    // Username validation
    if (!registerData.userName.trim()) {
      newErrors.userName = "Username is required.";
    } else if (registerData.userName.trim().length < 3) {
      newErrors.userName = "Username must be at least 3 characters.";
    } else if (registerData.userName.trim().length > 20) {
      newErrors.userName = "Username must be less than 20 characters.";
    }

    // First Name validation
    if (!registerData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (registerData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }

    // Last Name validation
    if (!registerData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (registerData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    }

    // Email validation
    if (!registerData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation
    if (!registerData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(registerData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(registerData.password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    if (registerData.confirmPassword.trim() !== registerData.password.trim()) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true));

      const registerResponse = await PublicAPI.post(`trader/register/`, {
        username: registerData.userName,
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
      });

      setRegisterData({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setOpen(false);

      localStorage.setItem("token", registerResponse.data.token);
      dispatch(setUser(registerResponse.data.user));
      dispatch(activateUser(true));

      const walletActivated = await activateWallet();
      if (walletActivated) {
        setKeyModalOpen(true);
      } else {
        dispatch(setAlertOn(true));
        dispatch(setAlertMessage("Error Creating Wallet, try again later"));
        dispatch(setAlertSeverity("error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      dispatch(setAlertOn(true));
      dispatch(setAlertMessage("Registration failed. Please try again."));
      dispatch(setAlertSeverity("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtpCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (!validateForm()) {
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("warning"));
      dispatch(setAlertMessage("Please correct the highlighted errors before submitting"));
      dispatch(setLoading(false));
      return;
    }
    try {
      const otpResponse = await PublicAPI.post(`verification/create/`, {
        email: registerData.email,
      });
      setOpen(true);
      dispatch(setLoading(false));
      dispatch(setAlertOn(true));
      dispatch(setAlertSeverity("info"));
      dispatch(setAlertMessage("Kindly Check the console for otp"));
      console.log("OTP: ", otpResponse.data.otp)
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
      setOtp("");
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

  // Animation variants for form fields
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Animation for feature cards
  const featureVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.6
      }
    })
  };

  return (
    <>
      <OTPModal
        open={open}
        handleClose={() => {
          setOpen(false); setOtp("");
        }}
        handleSubmit={handleOtpSubmit}
        otp={otp}
        setOtp={setOtp}
      />
      <KeyModal
        open={keyModalOpen}
        setOpen={setKeyModalOpen}
        passKey={walletData.passKey}
      />

      <Container maxWidth="lg" sx={{ minHeight: "100vh", padding: 0, overflow: "hidden"}}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            margin: { xs: 2 },
          }}
        >
          {/* Left side - Registration Form */}
          <Box
            component={motion.div}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 50%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: { xs: 3, md: 6 },
              backgroundColor: "#fff",
            }}
          >
            <Typography
              component={motion.h1}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              variant="h4"
              fontWeight="600"
              color="#2E5077"
              gutterBottom
            >
              Join The Revolution
            </Typography>

            <Typography
              component={motion.p}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              variant="body1"
              color="#666"
              sx={{ mb: 4 }}
            >
              Create your account and start securely trading with anonymity and verification
            </Typography>

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
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <TextField
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                  value={registerData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      "&:hover": { backgroundColor: "#f1f3f5" },
                      transition: "all 0.3s ease",
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#d0e8e6" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />
              </motion.div>

              {/* Last Name */}
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="lastName"
                  value={registerData.lastName}
                  onChange={handleChange}
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      "&:hover": { backgroundColor: "#f1f3f5" },
                      transition: "all 0.3s ease",
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#d0e8e6" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />
              </motion.div>

              {/* User Name */}
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <TextField
                  label="User Name"
                  variant="outlined"
                  fullWidth
                  name="userName"
                  value={registerData.userName}
                  onChange={handleChange}
                  error={!!errors.userName}
                  helperText={errors.userName}
                  required
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      "&:hover": { backgroundColor: "#f1f3f5" },
                      transition: "all 0.3s ease",
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#d0e8e6" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />
              </motion.div>

              {/* Email */}
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      "&:hover": { backgroundColor: "#f1f3f5" },
                      transition: "all 0.3s ease",
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#d0e8e6" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />
              </motion.div>

              {/* Password */}
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      "&:hover": { backgroundColor: "#f1f3f5" },
                      transition: "all 0.3s ease",
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#d0e8e6" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />
              </motion.div>
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      "&:hover": { backgroundColor: "#f1f3f5" },
                      transition: "all 0.3s ease",
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#d0e8e6" },
                      "&:hover fieldset": { borderColor: "#4DA1A9" },
                      "&.Mui-focused fieldset": { borderColor: "#4DA1A9" },
                    },
                  }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={5}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    backgroundColor: "#4DA1A9",
                    "&:hover": {
                      backgroundColor: "#3B8589",
                    },
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(77, 161, 169, 0.3)",
                  }}
                >
                  Register
                </Button>
              </motion.div>

              {/* Google Sign-in */}
              <motion.div
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
                custom={6}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Google />}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderColor: "#d0e8e6",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#4DA1A9",
                      backgroundColor: "#f1f3f5",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign up with Google
                </Button>
              </motion.div>

              <Typography
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                variant="body2"
                color="#666"
                align="center"
                sx={{ mt: 2 }}
              >
                Already have an account? <a href="/trader/login" style={{ color: "#4DA1A9", textDecoration: "none", fontWeight: 600 }}>Login</a>
              </Typography>
            </form>
          </Box>

          {/* Right side - Features */}
          <Box
            component={motion.div}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 50%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: { xs: 3, md: 6 },
              backgroundColor: "#2E5077",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background patterns */}
            <Box
              component={motion.div}
              animate={{
                opacity: [0.4, 0.5, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              sx={{
                position: "absolute",
                top: "10%",
                right: "5%",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(77,161,169,0.4) 0%, rgba(77,161,169,0) 70%)",
                zIndex: 0,
              }}
            />

            <Box
              component={motion.div}
              animate={{
                opacity: [0.3, 0.4, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              sx={{
                position: "absolute",
                bottom: "15%",
                left: "10%",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(77,161,169,0.3) 0%, rgba(77,161,169,0) 70%)",
                zIndex: 0,
              }}
            />

            <Typography
              component={motion.h2}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              variant="h4"
              fontWeight="600"
              sx={{ mb: 4, zIndex: 1, position: "relative" }}
            >
              Platform Features
            </Typography>

            <Box sx={{ zIndex: 1, position: "relative" }}>
              {features.map((feature, index) => (
                <Box
                  component={motion.div}
                  key={index}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h6" fontWeight="500" color="white">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }} color="white">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              variant="body2"
              sx={{ mt: 4, opacity: 0.7, textAlign: "center", zIndex: 1, position: "relative" }}
            >
              By registering, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;

                      