import Navbar from "../NavBar/Navbar";
import { Button, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "./bg3.jpg";
import { Link } from "react-router";


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ margin: "0", padding: "0", paddingTop: "72px" }}>
        <Box>
          <Box
            sx={{
              height: "80vh",
              backgroundImage: `url("${Image}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "0 20px",
              position: "relative",
              boxShadow: "10",
            }}
          />
          <Box
            sx={{
              textAlign: "center",
              position: "absolute",
              top: "100px",
              left: "20px",
              width: "40%"
            }}
          >
          <Typography
              variant="h5"
              sx={{ marginBottom: 0, fontWeight: "", color: "#F6F4F0" }}
            >
              Welcome to
            </Typography>
            <Typography
              variant="h3"
              sx={{ marginBottom: 2, fontWeight: "bold", color: "#F6F4F0" }}
            >
              Swapchain
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 3, color: "#FFFFFF" }}>
              A blockchain-powered platform where sustainability meets the
              future of commerce
            </Typography>
           <Link to="trader/register">
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="#features"
              sx = {{
                backgroundColor: "#2E5077"
              }}
            >
              Register Now
            </Button>
            </Link> 
          </Box>
        </Box>

        <Box
          id="features"
          sx={{
            padding: "60px 0",
          }}
        >
          <Grid container spacing={4}>
            <Grid size={4}>
              <Box sx={{ padding: 4, height: "60%" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  NFT Backed Authentication
                </Typography>
                <Typography variant="body1">
                  Each Products are backed up using NFT. Ownerships can be traced and transferred using blockchain
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box sx={{ padding: 4, height: "60%" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Blockchain-Powered Security
                </Typography>
                <Typography variant="body1">
                  Your transactions are secured and tracked on the blockchain,
                  ensuring trust and transparency.
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box sx={{ padding: 4, height: "60%" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Seamless Trading
                </Typography>
                <Typography variant="body1">
                  A simple and user-friendly interface to trade goods, services,
                  and crypto with ease.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            backgroundColor: "#282c34",
            color: "#fff",
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            © 2025 EcoSwapChain. All rights reserved.
          </Typography>
          <Button variant="text" sx={{ color: "#fff" }} href="#contact">
            Contact Us
          </Button>
        </Box>
      </div>
    </>
  );
};

export default LandingPage;
