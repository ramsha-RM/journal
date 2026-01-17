import React, { useState } from 'react'
import '../CSS/dashboard.css'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import logoutImg from '../assets/log-out.png'
import profileImg from '../assets/profile.jpg'
import { useEffect } from 'react'
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
const [quoteText, setQuoteText] = useState('');
const [message, setMessage] = useState(null); 
const [editId, setEditId] = useState(null);


useEffect(() => {
  const storedUserName = localStorage.getItem('username');
  if(storedUserName) 
  setUserName(storedUserName);
  handleGetAlljournals();
 }, [])

const moods = [
  {label: "happy", emoji: "😄" },
  {label: "sad", emoji: "😔" },
  {label: "angry", emoji: "😤" },
  {label: "tired", emoji: "😴" }
];

const handleCreateJournal = async () => {
if(!journalText.trim()){
  setMessage({type:"error", text:"Please write something!"});
  return;
}
const entry = {
  date: selectDate || new Date().toISOString().split('T')[0],
  text: journalText,
  mood: selectMoods || 'neutral',
  quote: quoteText
} 
try {
    if(editId){
    await updateJournals( editId, entry);
    setMessage({type: "success", text:"Journals updated!"});
    setEditId(null);
    }else{
  await createJournal(entry);
  setMessage({type: 'success', text:"Entery added successfully!"});
    }
    handleClear();
    handleGetAlljournals();
} catch (error) {
  console.error(error);
  setMessage({type:"error", text: error.response?.data?.error
  ||  "Server error!"})
  }
}
const handleGetAlljournals = async () => {
  try {
    const data = await getAlljournals();
     setAlljournals(data);
    // console.log('All journals:', data);
  } catch (error) {
    console.error(error);  
  }
};

const handleEditJournals = (journal) => {
  setEditId(journal.id);
  setSelectDate(journal.date);
  setJournalText(journal.text);
  setQuoteText(journal.quote || '');
  setSelectMoods(journal.mood);
}

const handleViewjournal = async (id) => {
  try {
    const data =  await getSinglejournal(id);
    setViewjournals(data);
  } catch (error) {
    console.error(error);
    setMessage({ type: "error", text: "Failed to load journal" });
  }
};


const handleDeleteJournal = async (id) => {
  try{
    await deleteJournal(id);
    setMessage({type:"success", text:"Journal deleted!"});
    handleGetAlljournals();
  }catch(error){
    console.error(error);
  }
};

const handleDeleteMedia = async (id) =>{
try {
  await deleteMedia(id);
  setMessage({type:"succes", text:"Media deleted"})
  handleGetAlljournals();
} catch (error) {
  console.error(error);
  setMessage({ type: "error", text: "Failed to delete media" });
}
}

const handleClear = () => {
  setSelectDate('');
  setJournalText('');
  setSelectMoods(null);
  setQuoteText('');
  setMessage(null);
  setEditId(null);
}
const handleLogout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('token');
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
        <a href="#" className="home">Home</a>
        <a href="#" className="calender">Calender</a>
        <a href="#" className="allentities">All Entities</a>
        <a href="#" className="insights">Insights</a>
        <a href="#" className="settings">Settings</a>
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
          {/* <input type="text" className="username" />UserName */}
        </div>
        <input type="date" className="date"
        value={selectDate}
        onChange={(e) => setSelectDate(e.target.value)} />
      </div>
      <textarea
        name="text"
        id="journaltext"
        className="journaltext"
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write about your day... thoughts, feelings, moments ✨"
      ></textarea>

      <div className="moods-time">
        <div className="feelings">
         {moods.map((mood) => (
          <button className={`moods ${mood.label} ${selectMoods === mood.label ? 'selected' : ''}`}
          key={mood.label}
          onClick={() => setSelectMoods(mood.label)}>
           <span className="emoji">{mood.emoji}</span>
           <span className="label">{mood.label.charAt(0).
           toUpperCase()+mood.label.slice(1)}</span>
          </button>
         ))
         }
        </div>
        <p className="timeweather">
          <span className="time">🕑 9:45 PM</span>
          <span className="dot">.</span>
          <span className="weather">Cloudy</span>
          <span className="weatheremoji">⛅</span>
        </p>
        
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
        {alljournals.length === 0 && <p className='no-journal'>No journals yet.</p>}
        {alljournals.map((journal) => (
          <div key={journal.id} className="journal-card">
            <div className="journal-header">
              <span className="journal-date">{journal.date}</span>
              <span className={`journal-mood ${journal.mood}`}>{journal.mood}</span>
            </div>
            <p className='journal-text'>{journal.text}</p>
            {journal.quote && <p className='journal-quote'>{journal.quote}</p>}

            {journal.media?.map((media) => (
        <div key={media.id} className="media-box" >
        <img src={media.url} alt="img" className="media-img" />
        <button className="delete-media-btn"
      onClick={() => handleDeleteMedia(media.id)}>❌</button>
     </div>
     ))}
            <div className="journal-actions">
              <button className="edit-btn" onClick={() => handleEditJournals(journal)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDeleteJournal(journal.id)}>Delete</button>
            </div>
          </div>
        ))}

      </div>
    </main>     
    </div>
  )
}
export default Dashboard
