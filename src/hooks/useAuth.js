import API from "../service/axios";

const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

export default function useAuth() {

  const setLoginToken = (token) => {
    if (token) localStorage.setItem(LOGIN_KEY, token);
  };

  const setAccessToken = (token) => {
      localStorage.setItem(ACCESS_KEY, token);
      localStorage.removeItem(LOGIN_KEY); 
  };

  const clearTokens = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(LOGIN_KEY);
  };

  // Lock preferences
  const checkLockPreferences = async () =>
    (await API.get("/lock/preferences")).data;

  const changeLockPreferences = async () =>
    (await API.put("/lock/preferences")).data;

  // Register
  const register = async (data) => {
    const res = await API.post("/auth/register", data);
    if (res.data?.email)
      localStorage.setItem("pendingEmail", res.data.email);
    return res.data;
  };

  //  LOGIN 
  const login = async (email, password) => {
    clearTokens();
    const res = await API.post("/auth/login", { email, password });
    console.log("LOGIN RESPONSE:", res.data);
    const loginToken = res.data.token;
    const user = res.data.user;

    setLoginToken(loginToken);

    localStorage.setItem("username", user?.username || user?.name || "User");
    localStorage.setItem("email", user?.email || "");
    localStorage.setItem("userId", user?.id || user?._id || "");

    const hasPinValue = await hasPin();

    return {
      hasPin: hasPinValue,
      isVerified: user?.isEmailVerified || false,
      user,
    };
  };

  // Verify account 
  const verifyAccount = async (data) => {
    const res = await API.post("/auth/verify-account", data);

    if (res.data?.loginToken) {
      setLoginToken(res.data.loginToken);
    }

    const user = res.user || {};
    localStorage.setItem("username", user.username || user.name || "User");
    if (user.email)
      localStorage.setItem("email", user.email);

    const hasPinValue = await hasPin();

    return {
      hasPin: hasPinValue,
      isVerified: user?.isEmailVerified || false,
      user,
    };
  };

  // PIN APIs
  const hasPin = async () =>{
   const res = await API.get("/pin/has-pin");
   return res.data?.hasPin || false;
  };

  const createPin = async (data) =>
    (await API.post("/pin/create", data)).data;

  // VERIFY PIN 
  const verifyPin = async (data) => {
    const res = await API.post("/pin/verify", data);
    const { accessToken } = res.data;

    setAccessToken(accessToken);

    return res.data;
  };

  return {
    checkLockPreferences,
    changeLockPreferences,
    login,
    register,
    verifyAccount,
    hasPin,
    createPin,
    verifyPin,
    clearTokens,
  };
}