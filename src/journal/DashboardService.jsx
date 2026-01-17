import API from '../pages/api'

export const createJournal = async (entry) => {
try {
  const res = await API.post('journals', entry);
  return res.data;
} catch (error) {
  console.error("Create journal error",error);
  throw error;
  }
};

export const getAlljournals = async (page = 1, limit = 5) => {
  try{
    const res = await API.get(`/journals?page=${page}&limit=${limit}`);
    return res.data;
  }catch(error){
    console.error("Get all journals error", error);
    throw error;
  }
};

export const getSinglejournal = async (id) => {
  try {
    const res = await API.get(`journals/${id}`);
   return res.data;
  } catch (error) {
    console.error("Get single journals error", error);
    throw error;
  }
};
export const updateJournals = async (id, updateEntry) => {
  try {
    const res = await API.put(`journals/${id}`, updateEntry);
    return res.data; 
  } catch (error) {
    console.error("Update journal error", error);
    throw error;
  }
};

export const deleteJournal = async (id) => {
  try{
    const res = await API.delete(`journals/${id}`);
    return res.data;
  }catch(error){
    console.error("delete journal error", error);
    throw error;
  }
};

export const deleteMedia = async (mediaId) => {
  try{
    const res = await API.delete(`journals/media/${mediaId}`)
    return res.data;
  }catch(error){
    console.error("Delete media error", error);
    throw error;
  }
}
