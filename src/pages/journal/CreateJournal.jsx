import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/dashboardstyle/createjournal.css';
import '../../style/dashboardstyle/dashboardLayout.css';
import Toast from '../../components/Toast';
import ProIcon from '../../assets/icons/profile.png';
import Skeleton from '../../components/Skeleton';

import {
  getSingleJournal,
  createJournal,
  updateJournal,
} from "../../service/journal.service";

import { useName } from "../../hooks/useName";
import { useProfile } from "../../hooks/useProfile";

const CreateJournal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [userName] = useName();
  const { profileImg } = useProfile();

  const isEditMode = Boolean(id);

  const [journalTitle, setJournalTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [selectMood, setSelectMood] = useState("Calm");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const moodEmojis = { Happy: "😄", Calm: "😌", Neutral: "😐", Sad: "😔" }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchSingleJournal = async () => {
      
      setLoading(true);
      try {
        if (id) {

          const data = await getSingleJournal(id);
          setJournalTitle(data.title || '');
          setJournalText(data.content || '');
          setSelectMood(data.mood || "Calm");
          setDate(data.journalDate?.split('T')[0] || '');
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        showToast("Failed to fetch journal", "error");
      } finally {
        setLoading(false);
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

      setTimeout(() => navigate('/journals'), 1000);
    } catch (error) {
      showToast("Action failed", "error");
    }
  };

  const handleClear = () => {
    setJournalTitle('');
    setJournalText('');
    setSelectMood("Calm");
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      <main className="main-content">
        <header className="top-header">
          <div className="welcome-section">
            {loading ? (
              <>
                <Skeleton width="80px" height="18px" style={{ marginBottom: "8px" }} />
                <Skeleton width="250px" height="32px" />
              </>
            ) : (
              <>
                <p>Hi {userName || "User"},</p>
                <h1>Welcome to Notevia!</h1>
              </>
            )}
          </div>
          <div className="profile-sec" onClick={() => navigate('/profile')}>
            <div className="profile-circle">
              {loading ? (
                <Skeleton width="100%" height="100%" borderRadius="50%" />
              ) : (
                <img className={!profileImg ? "default-icon" : ""} src={profileImg || ProIcon} alt="Profile" />
              )}
            </div>
          </div>
        </header>

        <div className="text-entryarea">
          {loading ? (
            <Skeleton width="180px" height="30px" style={{ marginBottom: "25px" }} />
          ) : (
            <h3 className="heading">{isEditMode ? "Edit Journal" : "New Journal"}</h3>
          )}

          <div className="entry-box">
            {loading ? (
              <div className="skeleton-form-body">
                <div className="title-feelings">
                  <div className="title-box">
                    <Skeleton width="60px" height="15px" style={{ marginBottom: "10px" }} />
                    <Skeleton width="100%" height="45px" borderRadius="8px" />
                  </div>
                  <div className="feelings">
                    <Skeleton width="140px" height="15px" style={{ marginBottom: "10px" }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} width="90px" height="40px" borderRadius="20px" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tag-date" style={{ marginTop: '20px' }}>
                  <div className="dateBox">
                    <Skeleton width="50px" height="15px" style={{ marginBottom: "10px" }} />
                    <Skeleton width="200px" height="45px" borderRadius="8px" />
                  </div>
                </div>

                <div className="textBox" style={{ marginTop: '20px' }}>
                  <Skeleton width="110px" height="15px" style={{ marginBottom: "10px" }} />
                  <Skeleton width="100%" height="250px" borderRadius="12px" />
                </div>

                <div className="actionbox" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                  <Skeleton width="100px" height="45px" borderRadius="8px" />
                  <Skeleton width="150px" height="45px" borderRadius="8px" />
                </div>
              </div>
            ) : (
              <>
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
                    <div className="mood-buttons">
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
                </div>

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

                <div className="textBox">
                  <label className="journal">Journal Entry</label>
                  <textarea
                    className="textarea"
                    placeholder='Journal Entry'
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                  />
                </div>

                <div className="actionbox">
                  <button className="cancel" onClick={handleClear}>Cancel</button>
                  <button className="save" onClick={handleSaveOrUpdate}>
                    {isEditMode ? "Update Journal" : "Save Journal"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJournal;