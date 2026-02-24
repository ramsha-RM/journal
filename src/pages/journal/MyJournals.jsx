import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from './Sidebar'
import {useNavigate} from 'react-router-dom'
import ProfileImg from '../../assets/icons/profile.png'
import SeaarchIcon from '../../assets/icons/searchicon.png'
import '../../style/dashboardstyle/dashboard.css'
import '../../style/dashboardstyle/dashboardLayout.css'

import EditIcon from '../../assets/icons/penciledit.png'
import EyeIcon from '../../assets/icons/eye.png'


const MyJournals = () => {

    const [userName, setUserName] = useState("User");
    const [journals, setJournals] = useState([
        { id:1, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"]},
        { id:2, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"]},
        { id:3, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"]},
        { id:4, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"]},
        { id:5, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"]},
        { id:6, title: "A Productive Day", content: "Today I finally completed...", mood: "Happy", tags: ["Work", "Design"]}
    ]);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };
const handleDelete = (id) => {
    const updateList = journals.filter(item => item.id !== id);
    setJournals(updateList);
}
useEffect(() => { 
  const savedName = localStorage.getItem('username');
  if (savedName) setUserName(savedName);
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
        <input type="date" className="date"/>
        {/* <input type="text" className="all-moods" /> */}
        <div className="search-wrapper">
        <img src={SeaarchIcon} alt="search-icon" className='search-icon'/>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="profile-circle">
        <img src={ProfileImg} alt="Profile" />
      </div>
      </div>
    </header>


  <div className="journal-body" style={{ display: "block" }}>
<section className="journals-section-grid">
   {journals.slice(0, 6).map((journals, index) => (
    <div key={journals.id || index} className="journal-item-card">
    <div className="card-top">
    <h3>{journals.title || "A Productive Day"}</h3>
    <span className="mood-tag">
        {journals.mood === 'Happy' ? "😊 Happy" : "😌 Calm"}
        </span>
        </div>
          <p className="card-date">12 Feb 2026</p>
          <p className="card-text">"{journals.content?.substring(0, 60)}..."</p>
                
        <div className="card-bottom">
        <div className="tags">
            <span className="tag">Work</span>
            <span className="tag">Design</span>
        </div>
        <div className="actions">
          <button className="action-btn" onClick={() => handleEditClick(journals.id)}>
            <img src={EyeIcon} alt="" />
          </button>
          <button className="action-btn"><img src={EditIcon} alt="" /></button>
          <button className="action-btn" onClick={() => handleDelete(journals.id)}>🗑️</button>
        </div>
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
