import axios from "axios";
import { logout } from "../utils/auth";
const bASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || 'login_token';
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token';

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
  '/auth/verification'
];


API.interceptors.request.use((config) => {
  const url = config.url || '';

  const loginToken = localStorage.getItem(LOGIN_KEY);
  const accessToken = localStorage.getItem(ACCESS_KEY);
  

  if (protectedRoutes.some((route) => url.includes(route))) {
    if (accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (pinRoutes.some((route) => url.includes(route))) {
    if (loginToken)
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
      window.location.href = '/pin/verify';
      return Promise.reject(error);
    }

    if (pinRoutes.some((route) => url.includes(route))) {
      const loginToken = localStorage.getItem(LOGIN_KEY);
      if(!loginToken){
      logout('/');
      }
     
      return Promise.reject(error);
    }

    logout('/');
  }

  return Promise.reject(error);
});
export default API;
