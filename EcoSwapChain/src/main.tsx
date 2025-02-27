// main.tsx (or index.tsx)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import store from "./store";
import { SwapTheme } from "./theme";




// Create root element once
const container = document.getElementById("root")!;
const root = createRoot(container);

// Main app component with proper exports
export const RootComponent = () => (
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={SwapTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

// Render the app
root.render(<RootComponent />);

// Add this for Fast Refresh support
if (import.meta.hot) {
  import.meta.hot.accept();
}