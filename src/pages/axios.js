import axios from "axios";
import { logout } from "../utils/auth";
const bASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: bASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const protectedRoutes = [
  '/journals',
  '/journals/create',
  '/journals/update',
  '/journals/delete',
];
const pinRoutes = [
  '/pin/create',
  '/pin/verify',
  '/pin/has-pin',
];
const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || 'login_token';
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token';

API.interceptors.request.use((config) => {
  if (config.url.includes('/auth')) return config;

  const loginToken = localStorage.getItem(LOGIN_KEY);
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const url = config.url || '';

  if (protectedRoutes.some((route) => url.includes(route)) && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (pinRoutes.some((route) => url.includes(route)) && loginToken) {
    config.headers.Authorization = `Bearer ${loginToken}`;
  }

  return config;
});

API.interceptors.response.use((res) => res, (error) => {
  const status = error.response?.status;
  const url = error.config?.url || '';
  if (!status) {
    return Promise.reject(error);
  }

  if (status === 401 || status === 403) {

    if (protectedRoutes.some((route) => url.includes(route))) {
      localStorage.removeItem(ACCESS_KEY);
      window.location.href = '/pin/create';
      return Promise.reject(error);
    }

    if (pinRoutes.some((route) => url.includes(route))) {
      logout('/login');
      return Promise.reject(error);
    }

    logout('/login');
  }

  return Promise.reject(error);
});
export default API;
