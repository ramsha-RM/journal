import API from "./axios";

export const createJournal = async (data) => {
  const res = await API.post("/journals", data);
  return res.data;
};

export const getAllJournals = async () => {
  const res = await API.get("/journals");
  return res.data;
};

export const getSingleJournal = async (id) => {
  const journalId = String(id).trim();
  if (!journalId) {
    throw new Error('Journal ID is required to fetch');
  }
  const res = await API.get(`/journals/${journalId}`);
  console.log("Fetched journal data:", res.data);
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
  if (!id || isNaN(id)) {
    throw new Error("Invalid journal ID");
  }

  return await API.delete(`/journals/${id}`);
};

export const adminDeleteJournal = async (userId, journalId, adminapi) => {
  if (!userId) {
    throw new Error("User ID is required for admin delete");
  }else if (!journalId) {
    throw new Error("Journal ID is required for admin delete");
  } else if (!adminapi) {
    throw new Error("Admin API key is required for admin delete");
  }

 try {
    const res = await API.delete(`/journals/admin/user/${userId}/journals/${journalId}?adminPin=${encodeURIComponent(adminapi)}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Admin delete journal failed");
  }
  }