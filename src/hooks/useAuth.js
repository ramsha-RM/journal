import API from '../service/axios';

const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || 'login_token';
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token';

export default function useAuth() {
    const checkLockPreferences = async () => {
        const res = await API.get('/lock/preferences');
        return res.data;
    };

    const changeLockPreferences = async () => {
        const res = await API.put('/lock/preferences');
        return res.data;
    };

    const hasPin = async () => {
        try{
        const res = await API.get('/pin/has-pin');
        return res.data;
        }catch(error){
            console.error("Error checking PIN existence:", error.response?.data || error.message);
            throw error;
        }  
    };

    const login = async ({ email, password }) => { 
        try {
            const res = await API.post('/auth/login', { email, password });    
            const { accessToken, loginToken, user } = res.data;

        if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
        if (loginToken) localStorage.setItem(LOGIN_KEY, loginToken);

    localStorage.setItem("username", user?.username || user?.name || "");
    localStorage.setItem("email", user?.email || "");
    if (user?.id || user?._id) localStorage.setItem("userId", user?.id || user?._id);
            
    const hasPinValue = await hasPin().then((res) => !!res?.hasPin);
            return { 
                hasPin: hasPinValue,
                isVerified: user?.isEmailVerified || false,
                user,
            };
        } catch (error) {
            console.log("BACKEND ERROR DETAILS:", error.response?.data);
            throw error; 
        }
    };

    const register = async (data) => { 
        const res = await API.post('/auth/register', data);
        return res.data;
    };
const verifyAccount = async (data) => {
    const res = await API.post('/auth/verify', data);
    const resp = res.data || {};

    // Extract tokens separately
    const loginToken = resp.loginToken || resp.token || resp.login_token || null;
    const accessToken = resp.accessToken || resp.access_token;

    // Store them in localStorage under separate keys
    if (loginToken) localStorage.setItem(LOGIN_KEY, loginToken);
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);

    // Store user info
    const user = resp.user || {};
    if (user.username || user.name || user.email) {
        localStorage.setItem("username", user.username || user.name || user.email);
    }
    if (user.email) localStorage.setItem("email", user.email);

    // Optionally set Axios default header for accessToken immediately
    if (accessToken) API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    const hasPinValue = await hasPin().then((res) => !!res?.hasPin).catch(() => false);

    return {
        hasPin: hasPinValue,
        isVerified: user?.isEmailVerified || false,
        user,
    };
};

    return {
        checkLockPreferences,
        changeLockPreferences,
        login,
        register,
        verifyAccount,
        hasPin,
    };
}