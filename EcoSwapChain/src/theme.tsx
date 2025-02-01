import { createTheme, ThemeOptions } from "@mui/material/styles";

// 🔹 Common Typography Styles
const typography = {
  fontFamily: "Roboto, Arial, sans-serif",
  h1: { fontSize: "2.5rem", fontWeight: 500 },
  h2: { fontSize: "2rem", fontWeight: 500 },
  body1: { fontSize: "1rem" },
};

// 🔹 Common Button Styles
const buttonStyles = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "8px", // Rounded corners for buttons
        textTransform: "none", // Disable uppercase transformation
      },
    },
  },
};

// 🔹 Common AppBar Styles
const appBarStyles = {
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none", // Remove shadow for a cleaner UI
      },
    },
  },
};

// ✅ **Light Theme**
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3674B5", light: "#578FCA", contrastText: "#FFFFFF" },
    secondary: { main: "#A1E3F9", contrastText: "#000000" },
    success: { main: "#D1F8EF", contrastText: "#000000" },
    background: { default: "#F5F5F5", paper: "#FFFFFF" },
    text: { primary: "#000000", secondary: "#3674B5" },
  },
  typography: {
    ...typography,
    h1: { ...typography.h1, color: "#3674B5" },
    h2: { ...typography.h2, color: "#3674B5" },
    body1: { ...typography.body1, color: "#000000" },
  },
  components: {
    ...buttonStyles,
    ...appBarStyles,
  },
} as ThemeOptions);

// ✅ **Dark Theme**
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90CAF9", light: "#BBDEFB", contrastText: "#000000" },
    secondary: { main: "#1E88E5", contrastText: "#FFFFFF" },
    success: { main: "#66BB6A", contrastText: "#FFFFFF" },
    background: { default: "#121212", paper: "#1E1E1E" },
    text: { primary: "#FFFFFF", secondary: "#90CAF9" },
  },
  typography: {
    ...typography,
    h1: { ...typography.h1, color: "#90CAF9" },
    h2: { ...typography.h2, color: "#90CAF9" },
    body1: { ...typography.body1, color: "#FFFFFF" },
  },
  components: {
    ...buttonStyles,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          boxShadow: "none",
        },
      },
    },
  },
} as ThemeOptions);
