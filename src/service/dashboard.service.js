import API from "@/service/axios";

export const createJournal = async (data) => {
  const res = await API.post("/journals", data);
  return res.data;
};

export const getAllJournals = async () => {
  const res = await API.get("/journals");
  return res.data;
};

export const getSingleJournal = async (id) => {
  const res = await API.get(`/journals/${id}`);
  return res.data;
};

export const updateJournal = async (id, data) => {
  const idStr = String(id).trim();
  if (!idStr) {
    throw new Error("Journal ID is required for update");
  }
  const res = await API.patch(`/journals/${idStr}`, data);
  return res.data;
};

export const deleteJournal = async (id) => {
  const idStr = String(id).trim();
  if (!idStr) {
    throw new Error("Journal ID is required");
  }
  const res = await API.delete(`/journals/${idStr}`);
  return res.data;
};

export const deleteMedia = async (mediaId) => {
  if (!mediaId) throw new Error("Media ID is required");
  const res = await API.delete(`/journals/media/${mediaId}`);
  return res.data;
};
