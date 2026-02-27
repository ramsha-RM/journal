import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/dashboardstyle/createjournal.css';
import '../../style/dashboardstyle/dashboardLayout.css'
import Toast from '../../components/Toast'
import ProfileImg from '../../assets/icons/profile.png';
import SearchIcon from '../../assets/icons/searchicon.png'; 

import {
  getSingleJournal,
  createJournal,
  getAllJournals,
  updateJournal,
} from "../../service/journal.service";

const CreateJournal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [journalTitle, setJournalTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [selectMood, setSelectMood] = useState("Calm");
  const [journals, setJournals] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const moodEmojis = { Happy: "😄", Calm: "😌", Neutral: "😐", Sad: "😔" }

  useEffect(() => {
    const handleSingleJournalFetch = async () => {
      if(!id) return;
      try {
        const data = await getSingleJournal(id);
        setJournalTitle(data.title || '');
        setJournalText(data.content || '');
        setSelectMood(data.mood || "Calm");
        setDate(data.journalDate?.split('T')[0] || '');
      } catch (err) {
        showToast("Failed to fetch journal", "error");
      }
    };
    handleSingleJournalFetch();
  }, [id]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getAllJournals();
      const journalArray = Array.isArray(data) ? data : data?.journals || data?.data || [];
      setJournals(journalArray);
      setFilteredJournals(journalArray);
    } catch (err) {
      showToast('Failed to fetch journals', 'error');
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

  const handleSaveOrUpdate = async () => {
    if (!journalText.trim()) {
       showToast("Journal content cannot be empty", "error");
      return;
    }

    try {
      const payLoad = {
        title: journalTitle.trim(),
        content: journalText.trim(),
        mood: selectMood,
        journalDate: date || new Date().toISOString().split('T')[0],
      };
      if (isEditMode) {
        await updateJournal(id, payLoad);
        showToast('Journal Updated!', 'success');
      } else {
        await createJournal(payLoad);
        showToast( 'Journal Saved!', 'success' );
      }
      navigate('/journals');

    } catch (err) {
      showToast("Action failed", "error");
    }finally{
      setLoading(false);
    }
  };

  const handleClear = () => {
    setJournalTitle('');
    setJournalText('');
    setSelectMood("Calm");
    // SetTags('');
    setDate('');
  };

  const weeklyStats = useMemo(() => {
    if (!Array.isArray(journals)) return { total: 0, thisWeek: 0, topMood: "N/A" };

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const thisWeekCount = journals.filter(j => new Date(j.journalDate) >= lastWeek).length;
    return { total: journals.length, thisWeek: thisWeekCount, topMood: "Calm" };
  }, [journals]);

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
            {/* <div className="search-wrapper">
              <img src={SearchIcon} alt="search" className='search-icon' style={{ filter: 'grayscale(1) opacity(0.5)' }} />
              <input type="text" placeholder="Search..." className="search-input" value={searchTerm} onChange={handleSearch} />
            </div> */}
            <div className="profile-circle" onClick={() => navigate('/profile')}>
              <img src={ProfileImg} alt="Profile" />
            </div>
          </div>
        </header>
    
    <div className="text-entryarea">
      <h3 className="heading">{isEditMode ? "Edit Journal" : "New Journal"}</h3>
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
        <div className="dateBox">
          <label htmlFor="date" className="datetitle">Date</label>
          <input type="date" className="dateInput" value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>
      </div>
    
    <div className="textBox">
      <label className="journal">Journal Entry</label>
      <textarea className="textarea" placeholder='Journal Entry' 
      value={journalText}
      onChange={(e) => setJournalText(e.target.value)}/>
    </div>
      
    
    <div className="actionbox">
      <button className="cancel" onClick={handleClear}>Cancel</button>
      <button className="save"  onClick={handleSaveOrUpdate}>{isEditMode ? "Update Journal" : "Save Journal"}</button>
    </div></div>
    </div>
    </main>
  </div>
  
);
}
export default CreateJournal