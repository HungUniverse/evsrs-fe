import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.ecorentt.me/api",
  headers: { "Content-Type": "application/json" },
});

const AUTH_PATHS = [
  "/Auth/sign-in",
  "/Auth/send-otp",
  "/Auth/verify-otp",
  "/Auth/complete-register",
];

api.interceptors.request.use(
  (config) => {
    const url = (config.url || "").toLowerCase();
    const isAuthCall = AUTH_PATHS.some((p) => url.endsWith(p.toLowerCase()));
    if (!isAuthCall) {
      const token = localStorage.getItem("token")?.replaceAll('"', "");
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
