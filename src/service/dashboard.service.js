import API from "./axios";

export const dashboardStats = async () => {
    const res = await API.get("/dashboard");
    return res.data;
}