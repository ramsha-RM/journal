import axios from "axios";

const API = axios.create({
baseURL: "https://new-my-journals.vercel.app",
headers:{
    "Content-Type": "application/json",
},
});
API.interceptors.request.use((config) => {
    const loginToken = localStorage.getItem("login_token");
    const pinToken  = localStorage.getItem("createPin_token");
    const token = pinToken || loginToken;
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
API.interceptors.response.use((response) => response, (error) => {
    if(error.response && error.response.status === 401) {
        const loginToken = localStorage.getItem("login_token");
        const pinToken = localStorage.getItem("createPin_token");

        if(loginToken && !pinToken){
            localStorage.removeItem("createPin_token");
            window.location.href = "/createpin";
        }else{
            localStorage.removeItem("createPin_token");
            localStorage.removeItem("login_token");
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
})
export default API;
