import { useState } from "react";
import API from "../service/axios";

const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

const useAuth = () => {
  const [user, setUser] = useState(null);

  const getLoginToken = () => localStorage.getItem(LOGIN_KEY);
  const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
  
  const setLoginToken = (token) => token && localStorage.setItem(LOGIN_KEY, token);
  const setAccessToken = (token) => token && localStorage.setItem(ACCESS_KEY, token);
   
const setSessionData = (res) => {
  const token = res.accessToken || res.token || res.access_token;
  if (token) {
    setAccessToken(token);
    
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        if (payload.sub) {
          localStorage.setItem("userId", String(payload.sub));
        } 
      }
    } catch {
      // console.error("FATAL: Token decoding failed");
    }
  } 
};

  const register = async (data) => {
    try {
      const res = await API.post("/auth/register", data);
      localStorage.setItem("pendingEmail", data.email);
      localStorage.setItem("pendingName", data.name);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const verifyAccount = async (payload) => {
    try {
      const res = await API.post("/auth/verify-account", payload);
      if (res.data?.token) setLoginToken(res.data.token);
      const hasPinStatus = res.data?.hasPin ?? res.data?.user?.pinVerified ?? false;
      return {
        ...res.data,
        hasPin: hasPinStatus
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };

   const login = async ({ email, password }) => {
  try {
    localStorage.clear();
    const res = await API.post("/auth/login", { email, password });
    if(res.data)
    setSessionData(res.data);
    
    const userData = res.data?.user || {};
    localStorage.setItem("username", userData.name || "User");

    setUser({
      id: localStorage.getItem("userId"), 
      email: userData.email,
      username: userData.name || userData.email?.split('@')[0],
      isVerified: userData.isEmailVerified,
      hasPin: userData.pinVerified || false,
    });

    return { 
        isVerified: userData.isEmailVerified, 
        hasPin: userData.pinVerified || false 
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};

  const getValidToken = () => getAccessToken() || getLoginToken();

  const createPin = async (pin) => {
    const token = getValidToken();
    if (!token) throw new Error("Authentication token missing");

    const res = await API.post("/pin/create", { pin }); // interceptor adds token
    setSessionData(res.data);
    return res.data;
  };

const verifyPin = async (pin) => {
  const token = getValidToken();
  if (!token) throw new Error("Authentication token missing");

  try {
    const res = await API.post("/pin/verify", { pin }); // interceptor adds token
    if (res.data) setSessionData(res.data);
    return res.data;
  } catch (error) {
    console.error("PIN verification failed:", error.response?.status, error.response?.data);
    throw error.response?.data || error;
  }
};
  const logout = () => {
    localStorage.removeItem(LOGIN_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
    window.location.href = "/";
  };
  return { register, verifyAccount, login, createPin, verifyPin, logout, user };
};

export default useAuth;