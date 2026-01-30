import React, { useState } from 'react'
import '../CSS/dashboard.css'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import logoutImg from '../assets/log-out.png'
import profileImg from '../assets/profile.jpg'
import { useEffect } from 'react'
import API from '../pages/axios';
import {
  createJournal,
  getAlljournals,
  getSinglejournal, 
  updateJournals, 
  deleteJournal, 
  deleteMedia} from "./DashboardService"  

const Dashboard = () => {
const navigate = useNavigate();
const [userName, setUserName] = useState('');
const [alljournals, setAlljournals] = useState([])
const [viewJournals, setViewjournals] = useState(null)
const [selectDate, setSelectDate] = useState('');
const [journalText, setJournalText] = useState('');
const [selectMoods, setSelectMoods] = useState(null);
const [selectFiles, setSelectFiles] = useState([]);
const [message, setMessage] = useState(null); 
const [editId, setEditId] = useState(null);
       
const moods = [
  {label: "happy", emoji: "😄" },
  {label: "sad", emoji: "😔" },
  {label: "angry", emoji: "😤" },
  {label: "tired", emoji: "😴" }
];

useEffect(() => {
  const dashboardinit = async () => {
    try{
      const token = localStorage.getItem('login_token');
      if(!token){
        navigate('/login');
        return;
      }
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) setUserName(storedUserName);

    const pinRef = await API.get('/pin/has-pin');
    if(!pinRef.data.hasPin){
      navigate('/pin/create');
      return;
    }
    await handleGetAlljournals();
  }catch (err) {
        console.error("Dashboard init failed", err);
        navigate('/pin/create');
      }};
      dashboardinit();
}, [navigate]);

useEffect(() => {
  if(message){
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }}, [message]);

const handleCreateJournal = async () => {
if(!journalText.trim()){
  setMessage({type:"error", text:"Please write something!"});
  return;
}

const formData = new FormData();
formData.append("journalDate", new Date(selectDate || Date.now()).toISOString());
formData.append("content", journalText.trim());
selectFiles.forEach(files => { formData.append("files", files);});
try {
    if(editId){
    const updateJournal = await updateJournals(String(editId), formData);
    setAlljournals(prev => {
    const safePrev = Array.isArray(prev) ? prev : [];
    return safePrev.map(j => (j.id === String(editId) ? updateJournal : j));
    });
    setMessage({type: "success", text:"Journals updated!"});
    setEditId(null);
    }else{
  const newJournal = await createJournal(formData);
  setAlljournals(prev =>  { 
    const safePrev = Array.isArray(prev) ? prev : [];
    return [newJournal, ...safePrev];
    });

  setMessage({type: 'success', text:"Entry added successfully!"});
    }

    handleClear();
} catch (error) {
  console.error('Journal creat/update error:', error.response?.data || error);
  setMessage({type:"error", text: error.response?.data?.message 
  ||  "Server error!",})
  }
};

const handleGetAlljournals = async () => {
  try {
    const response = await getAlljournals();
    const journalArray = Array.isArray(response) ? response : response.data || [];

    const normalized = journalArray.map(journal => ({
    ...journal,
    id: String(journal.id),
    journalDate: journal.journalDate || journal.journal_date,
      media: Array.isArray(journal.media) ? journal.media : 
      journal.media?.data || [],
    }));

    setAlljournals(normalized);
  } catch (error) {
    console.error("Failed to fetch error:", error);    
    setAlljournals([]) 
  }
};

const handleEditJournals = (journal) => {
  setEditId(journal.id);
  setSelectDate((journal.journal_date || journal.journalDate)?.split('T')[0] || "");
  setJournalText(journal.content || '');
  setSelectMoods(journal.mood || null);
  setSelectFiles([]);
};

const handleViewjournal = async (id) =>  {
  try {
    const data =  await getSinglejournal(id);
    setViewjournals(data);
  } catch (error) {
    console.error("View journal error:", error);
    setMessage({ type: "error", text: "Failed to load journal" });
  }
};

const handleDeleteJournal = async (id) => {
  if(!window.confirm("Are you sure you want to delete this journal? This action cannot be undone.")) return;
  try{
    await deleteJournal(id);
    setAlljournals(prev => prev.filter(j => j.id !== id))
    setMessage({type:"success", text:"Journal deleted!"});      
  }catch(error){
    console.error("Delete journal error:", error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || error.message || "Delete failed!";
    setMessage({type:'error', text: errorMsg});
  }
};

const handleDeleteMedia = async (id) =>{
if(!window.confirm("Delete this media?")) return;
try {
  await deleteMedia(id);
  setMessage({type:"success", text:"Media deleted"})
  setViewjournals(null);
  await handleGetAlljournals();
} catch (error) {
  console.error("Delete media error:", error);
  setMessage({ type: "error", text: "Failed to delete media" });
}
}

const handleClear = () => {
  setSelectDate('');
  setJournalText('');
  setSelectMoods(null);
  setSelectFiles([]);
  setMessage(null);
  setEditId(null);
}
const handleLogout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('login_token');
  localStorage.removeItem('pin_verified');
 navigate('/login')
}
  return (
    <div>
      <aside className="logoHeading">
      <div className="logo">
        <div className="logosec">
          <img src={journalImg} alt="journal" className="journal" />
          <h2 className="htext">DailyNotes</h2>
        </div>
        <p className="textline">Capture your day, live it fully</p>
      </div>
      <nav className="sidebar">
        <a href="#" onClick={(e) => {e.preventDefault(); navigate('/dashboard')}} className="home">Home</a>
        <a href="#" onClick={(e) => {e.preventDefault()}} className="calender">Calender</a>
        <a href="#" onClick={(e) => {e.preventDefault()}} className="allentities">All Entities</a>
        <a href="#" onClick={(e) => {e.preventDefault()}} className="insights">Insights</a>
        <a href="#" onClick={(e) => {e.preventDefault(); navigate('/password/change')}} className="settings">Settings</a>
      </nav>

      <button className="logoutBox" onClick={handleLogout} style={{cursor:'pointer'}}>
        <img src={logoutImg} alt="logout" className="logout-icon" />
        <span className="logoutname">Logout</span>
      </button>
    </aside>

    <main className="main">
      <div className="topmain">
        <div className="profile">
          <img src={profileImg} alt="profile" className="profileimg" />
          <p className="username">{userName}</p>
        </div>
        <input type="date" className="date"
        value={selectDate}
        onChange={(e) => setSelectDate(e.target.value)} />
      </div>
      <div className="journal-area">
      <textarea
        name="text"
        id="journaltext"
        className="journaltext"
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write about your day... thoughts, feelings, moments ✨"
      ></textarea>
        
        <label htmlFor="mediaUpload" className="upload-btn attached">
        📎Add videos & images </label>
      <input type="file"  id="mediaUpload" className="mediafiles" multiple accept='image/*,video/*' 
      onChange={(e) => setSelectFiles([...e.target.files])} />
      </div>
       {selectFiles.length > 0 && (
      <div className="journal-media-row">
      {selectFiles.map((file, idx) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
        return (
        <div key={idx} className="media-thumb" >
          {isVideo ? (
            <video src={url} muted controls/>
          ) : (
            <img src={url} alt="preview" /> 
          )}
        <button className="delete-media-btn" onClick={(e) => { e.stopPropagation(); 
        setSelectFiles(prev => prev.filter((_, i) => i !==idx))}} >❌</button>
        </div>
        );})}
      </div>
       )}

      <div className="moods-time">
        <div className="feelings">
         {moods.map((mood) => (
          <button key={mood.label} className={`moods ${selectMoods === mood.label ? "active" : ""}`}
          onClick={() => setSelectMoods(mood.label)} >
          <span className="emoji">{mood.emoji}</span>
          <span className="label">{mood.label.charAt(0).
          toUpperCase()+mood.label.slice(1)}</span>
          </button>
         ))
         }
        </div>
      </div>
      <div className="bottom">
        <p className="quote">Happiness is a journey, not a destination.</p>
        <div className="actions">
          <button onClick={handleCreateJournal} className="newEntryBtn">{editId ? "Update Entry" : "Add Entry"}</button>
          <button onClick={handleClear} className="clear">Clear</button>
        </div>
      </div>

      {message && (
        <div className='errBox'>
          <span>{message.text}</span>
          <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
      )}

  <div className="journalList">
    {Array.isArray(alljournals) && alljournals.map((journal) => (
      <div key={journal.id} className="journal-card"
      onClick={() => handleViewjournal(journal.id)}>
        <div className="journal-header">
          <span className="journal-date">{(journal.journal_date || journal.journalDate)?.split('T')[0]}</span>
        </div>
        <p className='journal-text'>{journal.content}</p>
        {/* {journal.quote && <p className='journal-quote'>{journal.quote}</p>} */}
      {Array.isArray(journal.media) && journal.media.length > 0 && (
       <div className="journal-media-row">
      {journal.media.slice(0, 3).map((media, idx) => {
      const isVideo = /\.(mp4|webm|ogg)$/i.test(media.url);
      return (
        <div
          key={media.id || idx}
          className="media-thumb" onClick={(e) => { e.stopPropagation(); 
          handleViewjournal(journal.id); }} >
          {isVideo ? (
            <video src={media.url} muted />
          ) : (
            <img src={media.url} alt="media" /> )}
          <button className="delete-media-btn" onClick={(e) => { e.stopPropagation(); 
          handleDeleteMedia(media.id); }} >❌</button>
        </div>);}
      )}
     </div>
       )}
        <div className="journal-actions">
              <button className="edit-btn" onClick={(e) => {e.stopPropagation(); handleEditJournals(journal)} }>Edit</button>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteJournal(journal.id)}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
 {viewJournals && (
  <div className="journal-view-modal">
    <button onClick={() => setViewjournals(null)}>Close</button>
    <h3>{(viewJournals.journal_date || viewJournals.journalDate)?.split('T')[0]}</h3>
    <p>{viewJournals.content}</p>
    <img type={viewJournals.media?.[0]?.id} src={viewJournals.media?.[0]?.url || ""} alt="media" />
  </div>
)}
    </main>     
    </div>
  )
}
export default Dashboard
