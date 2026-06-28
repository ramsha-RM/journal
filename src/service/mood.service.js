import API from "./api.interceptor";

export const overallMood = async () => {
  const res = await API.get("/mood/mood-summary");
  return res.data;
};

