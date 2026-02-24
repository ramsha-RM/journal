import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/dashboardstyle/createjournal.css';
import '../../style/dashboardstyle/dashboardLayout.css'
import ProfileImg from '../../assets/icons/profile.png';
import SearchIcon from '../../assets/icons/searchicon.png'; 

import {
  createJournal,
  getAllJournals,
  getSingleJournal,
  updateJournal,
  deleteJournal
} from "../../service/dashboard.service";

const CreateJournal = () => {
  const navigate = useNavigate();
  const [journalTitle, setJournalTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [selectMood, setSelectMood] = useState("Calm");
  const [tags, SetTags] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  
  const [journals, setJournals] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const moodEmojis = {
  Happy: "😄",
  Calm: "😌",
  Neutral: "😐",
  Sad: "😔"
  }

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getAllJournals();
      const journalArray = Array.isArray(data) ? data : data?.journals || data?.data || [];
      setJournals(journalArray);
    } catch (err) {
      showToast({ type: 'error', text: 'Failed to fetch journals' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const savedName = localStorage.getItem('username');
    if (savedName) setUserName(savedName);
  }, []);

  const handleSaveOrUpdate = async () => {
    if (!journalText.trim()) {
      showToast({ type: 'error', text: 'Journal content cannot be empty' });
      return;
    }

    try {
      if (editId) {
        await updateJournal(editId, { title: journalTitle, content: journalText });
        showToast({ type: 'success', text: 'Journal Updated!' });
      } else {
        await createJournal({
        title: journalTitle || "Untitled",
        content: journalText,
        // mood: selectMood,
        // tags,
        journal_date: date
      });
        showToast({ type: 'success', text: 'Journal Saved!' });
      }
      handleClear();
      fetchAll();
    } catch (err) {
      showToast("Action failed", "error");
    }
  };

  const handleClear = () => {
    setJournalTitle('');
    setJournalText('');
    setEditId(null);
    showToast({ text: "", type: "" });
  };

  const weeklyStats = useMemo(() => {
    if (!Array.isArray(journals)) return { total: 0, thisWeek: 0, topMood: "N/A" };
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const thisWeekCount = journals.filter(j => new Date(j.journal_date) >= lastWeek).length;
    return { total: journals.length, thisWeek: thisWeekCount, topMood: "Calm" };
  }, [journals]);

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
              <img src={SearchIcon} alt="search" className='search-icon' style={{ filter: 'grayscale(1) opacity(0.5)' }} />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
            <div className="profile-circle">
              <img src={ProfileImg} alt="Profile" />
            </div>
          </div>
        </header>
    
    <div className="text-entryarea">
      <h3 className="heading">New Journal</h3>
      <div className="entry-box">

        <div className="title-feelings">
          <div className="title-box">
            <label htmlFor="title">Title</label>
            <input type="text" className="titleInput" placeholder='My thoughts today'
            value={journalTitle} onChange={(e) => setJournalTitle(e.target.value)}/>
          </div>
          <div className="feelings">
            <label>How are you feeling?</label>
          {["Happy", "Calm", "Neutral", "Sad"].map((mood) => (
            <button key={mood} className={`moodsBtn ${selectMood === mood ? "activated" : ""}`}
            onClick={() => setSelectMood(mood)}>
              {moodEmojis[mood]} {mood}
            </button>
          ))}
          </div>
        </div>
      
      <div className="tag-date">
        <div className="tagsBox">
          <label htmlFor="tags">Tags</label>
          <input type="tags" className='tagsInput' placeholder='#work #Growth #Personal'
          value={tags} onChange={(e) => SetTags(e.target.value)} />
        </div>
        <div className="dateBox">
          <label htmlFor="date" className="datetitle">Date</label>
          <input type="date" className="dateInput" 
          value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>
      </div>
    
    <div className="textBox">
      <label className="journal">Journal Entry</label>
      <textarea className="textarea" placeholder='Journal Entry' 
      value={journalText}
      onChange={(e) => setJournalText(e.target.value)}/>
    </div>
      </div>
    
    <div className="actionbox">
      <button className="cancel" onClick={handleSaveOrUpdate}>Cancel</button>
      <button className="save" onClick={handleClear}>Save Journal</button>
    </div>
    </div>
    </main>
  </div>
  
);
}
export default CreateJournal