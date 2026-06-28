import API from "./api.interceptor";

export const dashboardStats = async () => {
    const res = await API.get("/dashboard");
    return res.data;
}