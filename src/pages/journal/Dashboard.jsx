import React, { useState, useEffect, useMemo } from 'react'
import {useNavigate} from 'react-router-dom'
import API from '../../service/axios'
import Sidebar from './Sidebar'
import '../../style/dashboardstyle/dashboard.css'
import '../../style/dashboardstyle/dashboardLayout.css'

import SeaarchIcon from '../../assets/icons/searchicon.png'
import ProfileImg from '../../assets/icons/profile.png'
import EditIcon from '../../assets/icons/penciledit.png'
import EyeIcon from '../../assets/icons/eye.png'

import IconJournal from '../../assets/icons/edit.png'
import IconWeek from '../../assets/icons/vector.png'
import IconStreak from '../../assets/icons/Vectorjournal.png'


import {
  createJournal,
  getAllJournals,
  getSingleJournal, 
  updateJournal, 
  deleteJournal, 
  deleteMedia
} from "../../service/dashboard.service"  

const Dashboard = () => {
const navigate = useNavigate();

// const [journalTitle, setJournalTitle] = useState('');
// const [viewJournals, setViewjournals] = useState(null)
// const [journalText, setJournalText] = useState('');
// const [selectFiles, setSelectFiles] = useState([]);
const [loading, setLoading] = useState(true);
const [userName, setUserName] = useState("User");
const [alljournals, setAlljournals] = useState([]);
const [showModal, setShowModal] = useState(false);
const [modalData, setModalData] = useState({ content: '', date: '', files: [] });
const [viewData, setViewData] = useState(null); 
const [editId, setEditId] = useState(null);
const [journals, setJournals] = useState([
   { id:1, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"], journal_date: new Date() },
   { id:2, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"], journal_date: new Date() }
]);
const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };
const fetchAll = async () => {
  try{
    setLoading(true);
    const data = await getAllJournals();

    let journalArray = [];
    if (Array.isArray(data)) {
      journalArray = data;
    } else if (data && Array.isArray(data.journals)) {
      journalArray = data.journals;
    } else if (data && Array.isArray(data.data)) {
      journalArray = data.data;
    }

    console.log("Fetched Journals:", journalArray);
if(journalArray.length > 0){
    setAlljournals(journalArray);
    setJournals(journalArray);
}
  }catch(err){
   showToast({type:"error", text:"Failed to fetch journals"})
  }finally{
    setLoading(false);
  }
};
useEffect(() => { fetchAll();
  const savedName = localStorage.getItem('username');
  if (savedName) setUserName(savedName);
 }, []);

const weeklyStats = useMemo(() => {
  if (!Array.isArray(journals)) {
  return { total: 0, thisWeek: 0, topMood: "N/A" };
  }
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);

const thisWeekCount = journals.filter(j => new Date(j.journal_date) >= lastWeek).length;

const moodCount = {};
journals.forEach(j => {
  if (j.mood) {
    moodCount[j.mood] = (moodCount[j.mood] || 0) + 1;
  }
}); 
const topMood = 
Object.keys(moodCount).length > 0
? Object.keys(moodCount).reduce((a, b) => 
moodCount[a] > moodCount[b] ? a:b) : "Mostly Calm";

return {
  total: journals.length,
  thisWeek: thisWeekCount,
  topMood: topMood
  };
}, [journals]);

const handleUpdate = async (id, updatedData) => {
    try {
      await updateJournal(id, updatedData);
      showToast({type:"success", tex:"Journal Updated!"});
      fetchAll();
    } catch (err) {
      showToast({type:'error', text: 'Update failed'});
    }
  };

const handleEditClick = async (id) => {
  try {
      const data = await getSingleJournal(id);
      setViewData(data);
      setEditId(id);
      setShowModal(true);
      setModalData(data);
    } catch (err) { 
    console.error(err);
   }
};

const handleDelete = async (id) => {
  console.log("Deleting ID:", id);
  if(window.confirm("Delete this?")){
    try{
      await deleteJournal(id);
      setAlljournals(prev => prev.filter(j => j._id !== id));
      setJournals(prev => prev.filter (j => j._id !== id));

      showToast({type:"success", text: "Journal deleted successfully"})
    } catch(err){
      console.error(err)
    const errorMsg = err.response?.data?.message || err.message || "Delete failed!";
    showToast(errorMsg,'error');
    }
  }
};

const handleMediaDelete = async (mediaId, journalId) =>{
if(!window.confirm("Delete this media?")) return;
try {
  await deleteMedia(mediaId);
  const updated = await getSingleJournal(journalId)
  setViewData(updated);
  fetchAll();
} catch (error) {
  console.error("Delete media error:", error);
  showToast({ type: "error", text: "Failed to delete media" });
}
};


const handleClear = () => {
  setSelectDate(dateToday);
  setJournals('');
  setSelectFiles([]);
  showToast(null);
  setEditId(null);
}

  return (
  <div className="dashboard-container">
    <Sidebar />
      {toast.show && (
        <div className={`toast-box ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          {toast.message}
        </div>
      )}
    <main className="main-content">
      <header className="top-header">
      <div className="welcome-section">
        <p>Hi {userName},</p>
        <h1>Welcome to Notevia!</h1>
      </div>

      <div className="search-bar-container">
        <div className="search-wrapper">
        <img src={SeaarchIcon} alt="search-icon" className='search-icon'/>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="profile-circle">
        <img src={ProfileImg} alt="Profile" />
      </div>
      </div>
    </header>

       <div className="stats-grid">
        <StatBox label="Total Journals" value={weeklyStats.total} icon={IconJournal} className="stat-total" iconBg='#4318FF'/>
        <StatBox label="This Week" value={weeklyStats.thisWeek} icon={IconStreak} className="stat-week" iconBg='#4318FF'/>
        <StatBox label="Writing Streak" value="12 Days" icon={IconWeek} className="stat-streak" iconBg='#F4F7FE'/>
        <StatBox label="Mood Status" value={weeklyStats.topMood} className="stat-mood-gradient" />
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={() => navigate('/create')}>+ New Journal</button>
        <button className="btn-secondary" onClick={() => navigate('/journals')}>View All Journals</button>
      </div>

      <div className="dashboard-body">
        <section className="recent-journals-section">
          <h2>Recent Journals</h2>
          <div className="journal-stack">
            {journals.slice(0, 4).map((journal) => {
              console.log("Journal object:", journal);
              return(
              <div key={journal._id || journal.id} className="journal-item-card">
                <div className="card-top">
                <h3>{journal.title || "A Productive Day"}</h3>
               <span className="mood-tag">
              {journal.mood === 'Happy' ? "😊 Happy" : "😌 Calm"}
          </span>
          </div>
          <p className="card-date">{journal.journal_date ? new Date(journal.journal_date).toLocaleDateString() : "Date"}</p>
          <p className="card-text">"{journal.content?.substring(0, 60)}..."</p>
                
          <div className="card-bottom">
            <div className="tags">
              <span className="tag">Work</span>
              <span className="tag">Design</span>
            </div>
            <div className="actions">
              <button className="action-btn">
              <img src={EyeIcon} alt="" /></button>
              <button className="action-btn" onClick={() => handleEditClick(journal._id || journal.id)}>
              <img src={EditIcon} alt="" /></button>
              <button className="action-btn" onClick={() => handleDelete(journal._id || journal.id)}>🗑️</button>
            </div>
          </div>
        </div>
      )})}
          </div>
        </section>

      <aside className="mood-summary-sidebar">
        <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Mood Summary</h2>
        <div className="mood-list">
        <MoodProgress label="Happy" percentage={65} color="#4318FF" emoji="😊" />
        <MoodProgress label="Calm" percentage={35} color="#4318FF" emoji="😌" />
        <MoodProgress label="Neutral" percentage={15} color="#4318FF" emoji="😐" />
        <MoodProgress label="Sad" percentage={10} color="#4318FF" emoji="😔" />
      </div></aside>
      </div></main></div>
);
};
  const StatBox = ({ label, value, icon, className, iconBg }) => (
<div className={`stat-card ${className}`}>
    <div className="stat-info" >
           {icon && (
        <div 
          className="stat-icon-wrapper" 
          style={{ backgroundColor: iconBg }}
        >
          <img src={icon} alt="icon" className='stat-icon' />
        </div>
      )}
     <div className="info">
      <span className="label" >{label}</span>
      <h3 className="value">{value}</h3></div>
    </div>
  </div>
);

const MoodProgress = ({ label, percentage, color, emoji }) => (
  <div className="progress-container">

      <div className='emoji-col'>{emoji}</div>

      <div className="content-col">
      <div className="text-row">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>

    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${percentage}%`, backgroundColor: color }} />
        </div>
    </div>
</div>
  
  );

export default Dashboard




