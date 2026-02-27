import React, { useState, useEffect, useMemo } from 'react'
import {useNavigate} from 'react-router-dom'
import Sidebar from './Sidebar'
import '../../style/dashboardstyle/dashboard.css'
import '../../style/dashboardstyle/dashboardLayout.css'
import Toast from '../../components/Toast'
import { StatBox, MoodProgress } from '../../components';

import SeaarchIcon from '../../assets/icons/searchicon.png'
import ProfileImg from '../../assets/icons/profile.png'
import EditIcon from '../../assets/icons/penciledit.png'
import EyeIcon from '../../assets/icons/eye.png'
import IconJournal from '../../assets/icons/edit.png'
import IconWeek from '../../assets/icons/vector.png'
import IconStreak from '../../assets/icons/Vectorjournal.png'

import {
  getAllJournals,
  getSingleJournal, 
  updateJournal, 
  deleteJournal, 
  deleteMedia
} from "../../service/journal.service"  

import { lastActivityDate, myStreak } from '../../service/streak.service'
import { overallMood } from '../../service/mood.service'
import { dashboardStats } from '../../service/dashboard.service'
import { adminDeleteJournal } from "../../service/journal.service";
import AdminDelJournal from '../../components/AdminDelJournal'

const Dashboard = () => {
const navigate = useNavigate();
const [deleteModel, setDeleteModel] = useState({ show: false, journalId: null, title: "", requireAdmin: false });

const [loading, setLoading] = useState(true);
const [userName, setUserName] = useState("User");

const [showModal, setShowModal] = useState(false);
const [modalData, setModalData] = useState({ content: '', date: '', files: [] });
const [viewData, setViewData] = useState(null); 
const [editId, setEditId] = useState(null);

const [lastActivity, setLastActivity] = useState(null);
const [streak, setStreak] = useState(0);
const [moodSummary, setMoodSummary] = useState({Happy: 0, Calm: 0, Neutral: 0, Sad: 0});
const [stats, setStats] = useState(null);
const [journals, setJournals] = useState([
  // { id:1, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy", journalDate: new Date() },
  // { id:2, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy", journalDate: new Date() }
]);
const [searchTerm, setSearchTerm] = useState('');
const [filteredJournals, setFilteredJournals] = useState(journals); 

const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

const fetchAll = async () => {
  try {
    setLoading(true);

    const [journalResp, streakResp, moodResp, lastActResp, dashboardResp] = await Promise.all([
      getAllJournals(),
      myStreak(),
      overallMood(),
      lastActivityDate(),
      dashboardStats()
    ]);

    const journalArray = journalResp?.journals || journalResp?.data ||
      (Array.isArray(journalResp) ? journalResp : []);
  
    if (journalArray.length > 0) {
      setJournals(journalArray);
      setFilteredJournals(journalArray);
    }

    setStreak(streakResp?.streak || streakResp?.streakDays || 0);
    setMoodSummary(moodResp || {});
    setLastActivity(lastActResp?.lastActivity || lastActResp?.lastActivityDate || null);
    setStats(dashboardResp || null);
  } catch (err) {
    showToast("Failed to load dashboard data", "error");
  } finally {
    setLoading(false);
  }
};

const handleSearch = (e) => {
  const term = e.target.value.toLowerCase();
  setSearchTerm(term);
  const filtered = journals.filter(j => 
    j.title?.toLowerCase().includes(term) || 
    j.content?.toLowerCase().includes(term)
  );
  setFilteredJournals(filtered);
};


useEffect(() => {
  fetchAll();
  const savedName = localStorage.getItem('username');
  if (savedName && savedName !== 'undefined') setUserName(savedName);
}, []);

 const weeklyStats =  useMemo(() => {
  if (!Array.isArray(journals)) {
  return { total: 0, thisWeek: 0, topMood: "N/A" };
  }
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);

const thisWeekCount = journals.filter(j => new Date(j.journalDate) >= lastWeek).length;

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
  topMood
  };
}, [journals]);

const handleUpdate = async (id, updatedData) => {
    try {
      await updateJournal(id, updatedData);
      showToast("Journal Updated!", "success");
      fetchAll();
    } catch (err) {
      showToast("Update failed", "error");
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


const confirmDelete = async (id, title, requireAdmin= false) => {
  setDeleteModel({ show: true, journalId: id, title, requireAdmin });
};

const handleDelete = async (adminKey) => {
  const { journalId, requireAdmin } = deleteModel;

  try {
    if(requireAdmin) {
      const userId = localStorage.getItem('userId');
    await adminDeleteJournal(userId, journalId, adminKey);
      showToast("Journal deleted successfully", "success");
    } else {
      await deleteJournal(journalId);
      showToast("Journal deleted successfully", "success");
  }
  fetchAll();
    } catch (err) {
     showToast("Delete failed", "error");
   } finally {
      setDeleteModel({ show: false, journalId: null, title: "", requireAdmin: false });
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
  showToast("Failed to delete media", "error");
}
};

  return (
  <div className="dashboard-container">
    <Sidebar />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    <main className="main-content">
      <header className="top-header">
      <div className="welcome-section">
        <p>Hi {userName},</p>
        <h1>Welcome to Notevia!</h1>
      </div>

      <div className="search-bar-container">
        <div className="search-wrapper">
        <img src={SeaarchIcon} alt="search-icon" className='search-icon'/>
        <input type="text" placeholder="Search..." className="search-input" value={searchTerm} onChange={handleSearch} />
      </div>
      <div className="profile-circle" onClick={() => navigate('/profile')}>
        <img src={ProfileImg} alt="Profile" />
      </div>
      </div>
    </header>

      <div className="stats-grid">
        <StatBox
          label="Total Journals"
          value={stats?.totalJournals || weeklyStats.total}
          icon={IconJournal}
          className="stat-total"
          iconBg="#4318FF"
        />
        <StatBox
          label="This Week"
          value={stats?.thisWeekJournals || weeklyStats.thisWeek}
          icon={IconStreak}
          className="stat-week"
          iconBg="#4318FF"
        />
        <StatBox
          label="Writing Streak"
          value={`${streak || 0} Days`}
          icon={IconWeek}
          className="stat-streak"
          iconBg="#F4F7FE"
        />
        <StatBox
          label="Mood Status"
          value={stats?.topMood || weeklyStats.topMood}
          className="stat-mood-gradient"
        />
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={() => navigate('/create')}>+ New Journal</button>
        <button className="btn-secondary" onClick={() => navigate('/journals')}>View All Journals</button>
      </div>

      <div className="dashboard-body">
        <section className="recent-journals-section">
          <h2>Recent Journals</h2>

          <div className="journal-stack">
            {filteredJournals.slice(0, 4).map((journal) => {
              return(
              <div key={journal._id || journal.id} className="journal-item-card">
                <div className="card-top">
                <h3>{journal.title || "A Productive Day"}</h3>
               <span className="mood-tag">
              {journal.mood === 'Happy' ? "😊 Happy" : "😌 Calm"}
          </span>
          </div>

          <p className="card-date">{journal.journalDate ? new Date(journal.journalDate).toLocaleDateString() : "Date"}</p>
          <p className="card-text">"{journal.content?.substring(0, 60)}..."</p>
                
      
            <div className="card-actions">
              <button className="action-btn" onClick={() => navigate(`/journal/${journal._id}`)}>
              <img src={EyeIcon} alt="" /></button>
              <button className="action-btn" onClick={() => handleEditClick(journal._id || journal.id)}>
              <img src={EditIcon} alt="" /></button>
              <button className="action-btn" onClick={() => confirmDelete(journal._id, journal.title || "Journal")}>🗑️</button>
         
          </div>
        </div>
      )})}
          </div>
        </section>

      <aside className="mood-summary-sidebar">
        <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Mood Summary</h2>
        <div className="mood-list">
          {Object.entries(moodSummary || {}).map(([label, percentage]) => {
            const emojiMap = { Happy: "😊", Calm: "😌", Neutral: "😐", Sad: "😔" };
            return (
              <MoodProgress
                key={label}
                label={label}
                percentage={percentage}
                color="#4318FF"
                emoji={emojiMap[label] || ""} />
            );})}
        </div>
      </aside>
      </div></main>
      <AdminDelJournal
      show={deleteModel.show}
      onClose={() => setDeleteModel({ show: false, journalId: null, title: "", requireAdmin: false })}
      onDelete={handleDelete}
      journalTitle={deleteModel.title}
      requireAdmin={deleteModel.requireAdmin} 
      />
      </div>
);};

export default Dashboard




