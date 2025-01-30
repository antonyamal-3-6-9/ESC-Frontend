import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Earth from "./AnImg/earth-svgrepo-com.svg";
import NFT from "./AnImg/nft-picture-svgrepo-com.svg";
import Goods from "./AnImg/package-svgrepo-com.svg";
import Carbon from "./AnImg/eco2-svgrepo-com.svg";

const Ani: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (window.scrollY > 50) {
        heroSection?.classList.add("scrolled");
      } else {
        heroSection?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      id="hero"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a2e38, #1a5a6c)",
        transition: "background 0.5s ease-in-out",
        '&': {
          animation: 'none',
          '&.scrolled': {
            background: "linear-gradient(135deg, #1a5a6c, #0a2e38)",
          },
        },
        '& > *': {
          animationPlayState: 'running',
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      <Box
        sx={{
          width: 300,
          height: 300,
          backgroundImage: `url(${Earth})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          position: "relative",
          animation: "spin 20s linear infinite",
          filter: "brightness(1.2)",
        }}
      ></Box>

      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          animation: "orbit 10s linear infinite",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundImage: `url(${NFT})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
            animationDelay: "0s",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></Box>
        <Box
          sx={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundImage: `url(${Goods})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
            animationDelay: "3.33s",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          }}
        ></Box>
        <Box
          sx={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundImage: `url(${Carbon})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
            animationDelay: "6.66s",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></Box>
      </Box>

      <Box
        className="network"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0, // Initially hidden
          transition: "opacity 1s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // Add this to trigger the opacity change on scroll:
          '&.scrolled': {
            opacity: 1, // Visible when scrolled
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 20 }}>
          <Box className="node" sx={{ width: 20, height: 20, borderRadius: "50%", background: "#48cfad", boxShadow: "0 0 10px rgba(72, 207, 173, 0.8)" }} />
          <Box className="node" sx={{ width: 20, height: 20, borderRadius: "50%", background: "#48cfad", boxShadow: "0 0 10px rgba(72, 207, 173, 0.8)" }} />
          <Box className="node" sx={{ width: 20, height: 20, borderRadius: "50%", background: "#48cfad", boxShadow: "0 0 10px rgba(72, 207, 173, 0.8)" }} />
          <Box className="node" sx={{ width: 20, height: 20, borderRadius: "50%", background: "#48cfad", boxShadow: "0 0 10px rgba(72, 207, 173, 0.8)" }} />
        </Box>
      </Box>

      <Typography
        className="message"
        sx={{
          position: "absolute",
          bottom: "20%",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          opacity: 0, // Initially hidden
          transition: "opacity 1s ease-in-out",
          width: "100%",
          color: "#ffffff",
          textShadow: "0 0 10px rgba(72, 207, 173, 0.8)",
          // Add this to trigger the opacity change on scroll:
          '&.scrolled': {
            opacity: 1, // Visible when scrolled
          },
        }}
      >
        A Global Platform for Secure, Transparent, and Eco-Friendly Trade.
      </Typography>
    </Box>
  );
};

export default Ani;