import API from "./api.interceptor"; 

export const checkLockPreferences = async () => {
    const res = await API.get("/lock/preferences");
    return res.data;
}

export const changeLockPreferences = async (data) => {
    const res = await API.put("/lock/preferences", data);
    return res.data;
} 

export const checkLockStatus = async () => {
    const res = await API.get("/heartbeat");
    return res.data;
}