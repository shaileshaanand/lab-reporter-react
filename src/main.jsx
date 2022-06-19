import React from "react";

import { NotificationsProvider } from "@mantine/notifications";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "react-query";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={new QueryClient()}>
    <React.StrictMode>
      <NotificationsProvider position="top-right">
        <App />
      </NotificationsProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
