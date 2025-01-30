import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FaLock, FaShippingFast } from "react-icons/fa";
import { IoMdLeaf } from "react-icons/io";
import { GiToken } from "react-icons/gi";
import { TiArrowForward } from "react-icons/ti";

const SeedToTrade: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        background: "#e0f7fa",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "2rem", color: "#00695c" }}>
        From Seed to Trade: A Sustainable Eco-Friendly Cycle
      </Typography>

      {/* Seed and plant animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Seed -> Plant Growth */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <IoMdLeaf size={100} color="#388e3c" />
        </motion.div>
      </motion.div>

      {/* NFT Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3, duration: 1 }}
        style={{ marginBottom: "2rem" }}
      >
        <GiToken size={60} color="#fbc02d" />
      </motion.div>

      {/* Escrow Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        style={{ marginBottom: "2rem" }}
      >
        <FaLock size={60} color="#0277bd" />
      </motion.div>

      {/* Shipping Hub Icon */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ delay: 5, duration: 1 }}
        style={{ marginBottom: "2rem" }}
      >
        <FaShippingFast size={60} color="#c2185b" />
      </motion.div>

      {/* Carbon Credit Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6, duration: 1 }}
        style={{ marginBottom: "2rem" }}
      >
        <GiToken size={60} color="#43a047" />
      </motion.div>

      {/* Trade Completion */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 7, duration: 1 }}
      >
        <TiArrowForward size={60} color="#00796b" />
      </motion.div>

      <Typography variant="h6" sx={{ marginTop: "2rem", color: "#004d40" }}>
        A Secure and Eco-Friendly Trade Platform.
      </Typography>
    </Box>
  );
};

export default SeedToTrade;
