import axios from "axios";
import { logout } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

  API.interceptors.request.use((config) => {
  const loginToken = localStorage.getItem(LOGIN_KEY);
  const accessToken = localStorage.getItem(ACCESS_KEY);
  

  // const pinRoutes = ["/pin", "/auth/verification", "/auth/verify-account"];
  // const isPinRoute = pinRoutes.some(route => config.url?.includes(route));
  if(accessToken){
    config.headers.Authorization = `Bearer ${accessToken}`;
  }else if (loginToken) {
    config.headers.Authorization = `Bearer ${loginToken}`;
  }

  // if (isPinRoute && loginToken) {
  //   config.headers.Authorization = `Bearer ${loginToken}`;
  // } else if (accessToken) {
  //   config.headers.Authorization = `Bearer ${accessToken}`;
  // }

  return config;
}, (error) => Promise.reject(error));


API.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if(status === 401) {
      localStorage.removeItem(LOGIN_KEY);
      localStorage.removeItem(ACCESS_KEY);
      window.location.href = "/";
    }
    if (status === 423) {
      window.location.href = "/pin/verify";
    } 
    return Promise.reject(error);
  }
);

export default API;