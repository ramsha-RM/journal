import API from "../service/axios";

const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

export default function useAuth() {

    const setTokens = ({ accessToken, loginToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (loginToken) localStorage.setItem(LOGIN_KEY, loginToken);
  };

  // Lock preferences
  const checkLockPreferences = async () => (await API.get("/lock/preferences")).data;
  const changeLockPreferences = async () => (await API.put("/lock/preferences")).data;

  // Register
  const register = async (data) => {
    const res = await API.post("/auth/register", data);
    if (res.data?.email) localStorage.setItem("pendingEmail", res.data.email);
    return res.data;
  };

  // Login
 const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { accessToken, loginToken, user } = res.data;

    setTokens({ accessToken, loginToken });

    localStorage.setItem("username", user?.username || user?.name || "User");
    localStorage.setItem("email", user?.email || "");
    localStorage.setItem("userId", user?.id || user?._id || "");

    const hasPinValue = await hasPin().then(r => !!r?.hasPin).catch(() => false);
    return { hasPin: hasPinValue, isVerified: user?.isEmailVerified || false, user };
  };
  
  // Verify account / PIN
  const verifyAccount = async (data) => {
    const res = await API.post("/auth/verify-account", data);
    const resp = res.data || {};

    setTokens({
      accessToken: resp.accessToken || resp.access_token,
      loginToken: resp.loginToken || resp.token
    });

    const user = resp.user || {};
    localStorage.setItem("username", user.username || user.name || "User");
    if (user.email) localStorage.setItem("email", user.email);

    const hasPinValue = await hasPin().then(r => !!r?.hasPin).catch(() => false);
    return { hasPin: hasPinValue, isVerified: user?.isEmailVerified || false, user };
  };

  // PIN APIs
  const hasPin = async () => (await API.get("/pin/has-pin")).data;
  const createPin = async (data) => (await API.post("/pin/create", data)).data;
  const verifyPin = async (data) => {
    const res = await API.post("/pin/verify", data);
    const { accessToken, loginToken } = res.data;

    if (accessToken) {
      localStorage.setItem(ACCESS_KEY, accessToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    if (loginToken) localStorage.setItem(LOGIN_KEY, loginToken);

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
  };
}