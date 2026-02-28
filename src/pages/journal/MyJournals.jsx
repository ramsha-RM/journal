import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from './Sidebar'
import {useNavigate} from 'react-router-dom'
import ProfileImg from '../../assets/icons/profile.png'
import SeaarchIcon from '../../assets/icons/searchicon.png'
import '../../style/dashboardstyle/dashboard.css'
import '../../style/dashboardstyle/dashboardLayout.css'
import Toast from '../../components/Toast'

import EditIcon from '../../assets/icons/penciledit.png'
import EyeIcon from '../../assets/icons/eye.png'
import { getAllJournals, getSingleJournal, deleteJournal } from '../../service/journal.service'
import { adminDeleteJournal } from "../../service/journal.service";

const MyJournals = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("User");
    const [journals, setJournals] = useState([
      // { id:1, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:2, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:3, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:4, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:5, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:6, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:7, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" },
      // { id:8, title: "A Productive Day", content: "Today I finally completed the dashboard design…", mood: "Happy" }
    ]);
    const [filteredJournals, setFilteredJournals] = useState(journals);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [viewData, setViewData] = useState(null);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteModel, setDeleteModel] = useState({ show: false, journalId: null, title: "", requireAdmin: false });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchJournal = async () => {
    try {
   const data = await getAllJournals();
   const jouralArray = data?.journals || data?.data || 
   (Array.isArray(data) ? data : []);
   if (jouralArray.length > 0) {
     setJournals(jouralArray);
     setFilteredJournals(jouralArray);
   }
  } catch (err) {
    showToast("Failed to fetch journals", "error");
  }
  };

  // search journals by title or content
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
    fetchJournal();
  }, []);

  const confirmDelete = (id, title, requireAdmin = false) => {
    setDeleteModel({ show: true, journalId: id, title, requireAdmin });
  };

  const confirmAdminDelete = (id, title) => {
    setDeleteModel({ show: true, journalId: id, title, requireAdmin: true });
  };

  const handleDelete = async (adminKey) => {
  const { journalId, requireAdmin } = deleteModel;

  try {
    if(requireAdmin) {
      const userId = localStorage.getItem('userId');
      await adminDeleteJournal(userId, journalId, adminKey);
      showToast("Journal deleted by admin successfully", "success");
    }else{
      await deleteJournal(journalId);
      showToast("Journal deleted successfully", "success");
    }
    fetchJournal();
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || "Delete failed!";
    showToast(errorMsg, "error");
  } finally {
    setDeleteModel({ show: false, journalId: null, title: "", requireAdmin: false });
  }
};

useEffect(() => {
  const savedName = localStorage.getItem('username');
  setUserName(savedName && savedName !== 'undefined' ? savedName : "User");
}, []);

const handleEditClick = async (id) => {
  try {
      const data = await getSingleJournal(id);
      setViewData(data);
      setEditId(id);
      setShowModal(true);
    } catch (err) { 
    console.error(err);
   }
};

  return (
    <div className='dashboard-container'>
      <Sidebar />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    <main className="main-content">
      <header className="top-header">
      <div className="welcome-section">
        <p>Hi {userName},</p>
        <h1>Welcome to Notevia!</h1>
      </div>

      <div className="search-bar-container">
        <input type="date" className="date"/>
  
        <div className="search-wrapper">
        <img src={SeaarchIcon} alt="search-icon" className='search-icon'/>
        <input type="text" placeholder="Search..." className="search-input" value={searchTerm} onChange={handleSearch} />
      </div>
      <div className="profile-circle" onClick={() => navigate('/profile')}>
        <img src={ProfileImg} alt="Profile" />
      </div>
      </div>
    </header>


  <div className="journal-body" style={{ display: 'block'}}>
<section className="journals-section-grid">
   {filteredJournals.slice(0, 10).map((journal, index) => (
    <div key={journal._id || journal.id || index} className="journal-item-grid">
    <div className="card-top">
    <h3>{journal.title || "A Productive Day"}</h3>
    <span className="mood-tag">
        {journal.mood === 'Happy' ? "😊 Happy" : journal.mood === 'Sad' ? "😔 Sad" : journal.mood === 'Neutral' ? "😐 Neutral" : "😌 Calm"}
        </span>
        </div>
          <p className="card-date" >{journal?.journal_date ? new Date(journal.journal_date).toLocaleDateString("en-US", {
             weekday: "short",
             year: "numeric",
             month: "short",
             day: "numeric"
            }) : new Date().toLocaleDateString()}</p>
          <p className="card-text">"{journal.content?.substring(0, 60)}..."</p>
                
      <div className="card-actions">
          <button className="action-btn" onClick={() => {
           const journalId = journal?._id || journal?.id;
           if (!journalId) {
           console.error("Journal ID missing:", journal);
           showToast("Invalid journal ID", "error"); return; }
            navigate(`/journal/${journalId}`); }}>

          <img src={EyeIcon} alt="" /></button>
          <button className="action-btn" onClick={() => navigate(`/create/${journal._id}`)}>
          <img src={EditIcon} alt="" /></button>
          <button className="action-btn" onClick={() => handleDelete(journal._id)}>🗑️</button>
          
        </div>
    </div>
        
   ))}
</section>
</div>
</main>
</div>

  )
}

export default MyJournals
