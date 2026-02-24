import API from '../service/axios';

const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || 'login_token';
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token';

export default function useAuth() {

const checkLockPreferences = async () => {
   const res = await API.get('/lock/preferences');
   return res.data;
}

const changeLockPreferences = async () => {
   const res = await API.put('/lock/preferences');
   return res.data;
}

const login = async (data) => { 
    try {
        const res = await API.post('/auth/login', data);
        console.log("SUCCESS RESPONSE:", res.data);
        
        const { token, user } = res.data;
        localStorage.setItem(LOGIN_KEY, token);
        localStorage.setItem("username", user.name);
        
        return { 
            hasPin: await hasPin().then(res => res.hasPin),
            isVerified: user?.isEmailVerified || false 
        };
    } catch (error) {
        console.log("BACKEND ERROR DETAILS:", error.response?.data);
        throw error; 
    }
};
    const register = async (data) => { 
    const res = await API.post('/auth/register', data)
    return res.data;
};
    const verifyAccount = async (data) => {
    const res = await API.post('/auth/verify-account', data);
    const { token } = res.data;
    localStorage.setItem(LOGIN_KEY, token);
    return res.data;
};
    const createPin = async (data) => {
    const res = await API.post('/pin/create', data)
    return res.data;
};
    const verifyPin = async (data) => {
    const res = await API.post('/pin/verify', data);
    const { accessToken } = res.data;
    localStorage.setItem(ACCESS_KEY, accessToken);
    
    return res.data;
};
    const hasPin = async () => {
    const res = await API.get('/pin/has-pin')
    return res.data;
};
    return { register, login, verifyAccount, createPin, verifyPin, hasPin,
        checkLockPreferences, changeLockPreferences
     };
}