import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./i18n";
import App from "./App";
import { SnackbarProvider } from "./contexts/SnackbarContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
);
