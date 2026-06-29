import API from "./api.interceptor";

export const fetchUsers = (params) =>
  API.get("/users", { params });


export const deleteUser = (id, adminPassKey) =>
  API.delete(`/users/${id}`, {
    params: { adminPassKey },
  });


  export const verifyAdminKey = (adminPassKey) =>
  API.get("/users/verify-admin-key", {
    params: { adminPassKey },
  });