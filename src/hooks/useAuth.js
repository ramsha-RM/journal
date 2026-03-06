import { useState } from "react";
import API from "../service/axios";

const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

const useAuth = () => {
  const [user, setUser] = useState(null);

  const getLoginToken = () => localStorage.getItem(LOGIN_KEY);
  const getAccessToken = () => localStorage.getItem(ACCESS_KEY);

  const setTokens = (loginToken, accessToken) => {
    if (loginToken) localStorage.setItem(LOGIN_KEY, loginToken);
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  };

  const clearTokens = () => {
    localStorage.removeItem(LOGIN_KEY);
    localStorage.removeItem(ACCESS_KEY);
  };

  // Register
  const register = async (data) => {
    try {
      const res = await API.post("/auth/register", data);

      if (res.data?.login_token) {
        setTokens(res.data.login_token, null);
        }
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Verify Account
const verifyAccount = async (data) => {
  try {
    const loginToken = localStorage.getItem(LOGIN_KEY);

    const res = await API.post( "/auth/verify-account", data,
      {
        headers: { Authorization: `Bearer ${loginToken}`,},
      });

    if (res.data?.token) {
      setTokens(null, res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

  // Create PIN
  const createPin = async (pin) => {
    try {
      const accessToken = getAccessToken();

      const res = await API.post( "/auth/create-pin", { pin },
        {
          headers: { Authorization: `Bearer ${accessToken}`, },
        });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Verify PIN
  const verifyPin = async (pin) => {
    try {
      const accessToken = getAccessToken();

      const res = await API.post("/auth/verify-pin", { pin },
        {
         headers: { Authorization: `Bearer ${accessToken}`, },
        });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Login
  const login = async (data) => {
    try {
      const res = await API.post("/auth/login", data);

      if (res.data?.access_token) {
        setTokens(null, res.data.access_token);
      }
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Check if user has PIN
  const hasPin = async () => {
    try {
      const accessToken = getAccessToken();

      const res = await API.get("/auth/has-pin", {
        headers: {
          Authorization: `Bearer ${accessToken}`,},
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Logout
  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return {
    register,
    verifyAccount,
    createPin,
    verifyPin,
    login,
    hasPin,
    logout,
    user,
  };
};

export default useAuth;