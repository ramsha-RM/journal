import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/dashboardstyle/createjournal.css';
import '../../style/dashboardstyle/dashboardLayout.css';
import Toast from '../../components/Toast';
import ProIcon from '../../assets/icons/profile.png';
import UserImg from "../../assets/icons/profile-edit.svg";

import {
  getSingleJournal,
  createJournal,
  getAllJournals,
  updateJournal,
} from "../../service/journal.service";

import { useName } from "../../hooks/useName";
import { useProfile } from "../../hooks/useProfile";

const CreateJournal = () => {
  const navigate = useNavigate();
  const { id } = useParams();


  const [ userName ] = useName();      
  const { profileImg } = useProfile();   

  const isEditMode = Boolean(id);

  const [journalTitle, setJournalTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [selectMood, setSelectMood] = useState("Calm");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const moodEmojis = { Happy: "😄", Calm: "😌", Neutral: "😐", Sad: "😔" }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    if (!id) return;
    const fetchSingleJournal = async () => {
      try {
        const data = await getSingleJournal(id);
        setJournalTitle(data.title || '');
        setJournalText(data.content || '');
        setSelectMood(data.mood || "Calm");
        setDate(data.journalDate?.split('T')[0] || '');
      } catch {
        showToast("Failed to fetch journal", "error");
      }
    };
    fetchSingleJournal();
  }, [id]);

  const handleSaveOrUpdate = async () => {
    if (!journalText.trim()) {
      showToast("Journal content cannot be empty", "error");
      return;
    }

    try {
      const payload = {
        title: journalTitle.trim(),
        content: journalText.trim(),
        mood: selectMood,
        journalDate: date || new Date().toISOString().split('T')[0],
      };
      if (isEditMode) {
        await updateJournal(id, payload);
        showToast('Journal Updated!', 'success');
      } else {
        await createJournal(payload);
        showToast('Journal Saved!', 'success');
      }
      navigate('/journals');
    } catch {
      showToast("Action failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setJournalTitle('');
    setJournalText('');
    setSelectMood("Calm");
    setDate(new Date().toISOString().split('T')[0]);
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

        {/* Header */}
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName || "User"},</p>
            <h1>Welcome to Notevia!</h1>
          </div>
          <div className="profile-circle" onClick={() => navigate('/profile')}>
            <img className={!profileImg ? "default-icon" : ""}  src={profileImg ||  ProIcon} alt="Profile" />
          </div>
        </header>

        {/* Journal Form */}
        <div className="text-entryarea">
          <h3 className="heading">{isEditMode ? "Edit Journal" : "New Journal"}</h3>
          <div className="entry-box">

            {/* Title and Mood */}
            <div className="title-feelings">
              <div className="title-box">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="titleInput"
                  placeholder='My thoughts today'
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                />
              </div>

              <div className="feelings">
                <label>How are you feeling?</label>
                {["Happy", "Calm", "Neutral", "Sad"].map((mood) => (
                  <button
                    key={mood}
                    className={`moodsBtn ${selectMood === mood ? "activated" : ""}`}
                    onClick={() => setSelectMood(mood)}
                  >
                    {moodEmojis[mood]} {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="tag-date">
              <div className="dateBox">
                <label htmlFor="date" className="datetitle">Date</label>
                <input
                  type="date"
                  className="dateInput"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Journal Text */}
            <div className="textBox">
              <label className="journal">Journal Entry</label>
              <textarea
                className="textarea"
                placeholder='Journal Entry'
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="actionbox">
              <button className="cancel" onClick={handleClear}>Cancel</button>
              <button className="save" onClick={handleSaveOrUpdate}>
                {isEditMode ? "Update Journal" : "Save Journal"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJournal;