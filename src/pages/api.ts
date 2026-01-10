import axios from "axios";
const API = axios.create({
baseURL: "https://new-my-journals.vercel.app/",
headers:{
    "Content-Type": "application/json",
},
});
export default API;
