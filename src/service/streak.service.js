import API from "./api.interceptor"; 

export const lastActivityDate = async () => {
  const res = await API.get("/streaks/last-activity");
  return res.data;
};

export const myStreak = async () => {
  const res = await API.get("/streaks/my-streak");
  return res.data;
};