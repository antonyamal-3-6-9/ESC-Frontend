import { TextField, Button, Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Import Grid2
import Container from "@mui/material/Container"; // Ensure correct import of Container
import { Google } from "@mui/icons-material";
import RImg from "./RImg.jpg";
import Navbar from "../NavBar/Navbar";

const Register = () => {
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
