import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "./providers/ThemeProvider.jsx";
import App from "./App.jsx";
import "./styles/index.scss";
import "./styles/slider.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
