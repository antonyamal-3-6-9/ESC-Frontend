import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Use "react-router-dom" instead of "react-router"
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme.tsx";

// Creating a component to manage the theme state
const RootComponent = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  return (
    <BrowserRouter>
      <StrictMode>
        <Provider store={store}>
          <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
            <CssBaseline />
            <App /> 
          </ThemeProvider>
        </Provider>
      </StrictMode>
    </BrowserRouter>
  );
};

// Mounting the component
createRoot(document.getElementById("root")!).render(<RootComponent />);
