import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const loginToken = localStorage.getItem(LOGIN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (loginToken) {
    config.headers.Authorization = `Bearer ${loginToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;
    
    const authRoutes = ["/", "/pin/verify", "/verification", "/register"];
    
    if (status === 401 && !authRoutes.includes(path)) {
      localStorage.removeItem(LOGIN_KEY);
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem("userId");
      window.location.href = "/";
    }

    if (status === 423 && path !== "/pin/verify") {
      window.location.href = "/pin/verify";
    }

    return Promise.reject(error);
  }
);

export default API;