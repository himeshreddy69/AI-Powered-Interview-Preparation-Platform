import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";                 // page reset
import "./assets/styles/tokens.css";  // type scale, spacing, radius, shadows
import "./assets/styles/themes.css";  // colour tokens + dark mode

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*
      Opt in to the v7 behaviours now. React Router logs a warning for each
      one it is about to change, and both are already how this app behaves —
      the flags just stop the console noise and make the v7 upgrade a no-op.
    */}
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);