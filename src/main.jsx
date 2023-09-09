import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <RouterProvider router={router} />
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
