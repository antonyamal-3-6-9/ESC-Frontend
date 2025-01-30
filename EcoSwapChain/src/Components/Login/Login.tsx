import { TextField, Button, Typography, Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Import Grid2
import Container from "@mui/material/Container"; // Ensure correct import of Container
import { Google } from "@mui/icons-material";
import LImg from "./LImg.jpg"; // Replace with your image path
import Navbar from "../NavBar/Navbar"; // Navbar component

const Login = () => {
  return (
    <>
      <Navbar />
      <Container
        maxWidth={"md"}
        disableGutters
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6F4F0", // Light background
          marginTop: 12,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#2E5077", // Title color
            textAlign: "center",
          }}
        >
          SIGN IN
        </Typography>
        <Grid2 container>
          {/* Left Side - Image */}
          <Grid2 size={7}>
            <Box
              sx={{
                height: "80vh",
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
          <Grid2 size={5}>
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
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "#4DA1A9" },
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

                {/* Password */}
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "#4DA1A9" },
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

                {/* Login Button */}
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
                  Login
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

export default Login;
