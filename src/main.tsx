import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router.tsx";

// Temporarily disable StrictMode to prevent double API calls in development
const isDevelopment = import.meta.env.DEV;

createRoot(document.getElementById("root")!).render(
  isDevelopment ? (
    <RouterProvider router={router} />
  ) : (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
);
