import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider }
from "./context/AuthContext";

import { NotificationProvider }
from "./context/NotificationContext";

const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

root.render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);
