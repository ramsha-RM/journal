import API from "./axios";

export const createJournal = async (data) => {
  const res = await API.post("/journals", data);
  return res.data;
};

export const getAllJournals = async () => {
  try {
    const res = await API.get("/journals");
    const response = res.data;
    const journals = Array.isArray(response) ? response : (response?.journals || response?.data || []);
    
    let currentId = localStorage.getItem("userId");

    if (!currentId || currentId === "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          currentId = payload.sub;
        } catch {
          console.error("Could not parse token for ID");
        }
      }
    }

    if (!currentId) return [];
    return journals.filter(j => String(j.user_id) === String(currentId));
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const getSingleJournal = async (id) => {
  const journalId = String(id).trim();
  if (!journalId) {
    throw new Error('Journal ID is required to fetch');
  }
  const res = await API.get(`/journals/${journalId}`);
  return res.data;
};

export const updateJournal = async (id, data) => {
  const journalId = String(id).trim();
  if (!journalId) {
    throw new Error("Journal ID is required for update");
  }
  const res = await API.patch(`/journals/${journalId}`, data);
  return res.data;
};

export const deleteMedia = async (mediaId) => {
  if (!mediaId) throw new Error("Media ID is required");
  const res = await API.delete(`/journals/media/${mediaId}`);
  return res.data;
};

export const deleteJournal = async (id) => {
 const journalId = String(id).trim();
 if(!journalId) {
  throw new Error("Invalid journal Id")
 }
  const res = await API.delete(`/journals/${journalId}`);
  return res.data;
};

export const adminDeleteJournal = async (userId, journalId, adminapi) => {
  if (!userId) {
    throw new Error("User ID is required for admin delete");
  }
  if (!journalId) {
    throw new Error("Journal ID is required for admin delete");
  }
  if (!adminapi) {
    throw new Error("Admin API key is required for admin delete");
  }
  try {
    const res = await API.delete(
      `/journals/admin/user/${userId}/journals/${journalId}?adminPin=${encodeURIComponent(adminapi)}`
    );

    return res.data;
  } catch (error) {
    throw new Error( error.response?.data?.message || error.message ||
     "Admin delete journal failed" );
  }
};