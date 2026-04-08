import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "../../components/Toast";
import AdminDelJournal from "../../components/AdminDelJournal";
import MoodProgress from "../../components/MoodProgress";

import "../../style/dashboardstyle/dashboard.css";
import "../../style/dashboardstyle/dashboardLayout.css";

import SeaarchIcon from "../../assets/icons/searchicon.png";
import ProImg from "../../assets/icons/profile.png";
import EyeIcon from "../../assets/icons/eye.png";
import EditIcon from "../../assets/icons/penciledit.png";
import IconJournal from "../../assets/icons/edit.png";
import IconWeek from "../../assets/icons/vector.png";
import IconStreak from "../../assets/icons/Vectorjournal.png";

import {
  getAllJournals,
  deleteJournal,
  adminDeleteJournal,
} from "../../service/journal.service";
import { myStreak } from "../../service/streak.service";
import { overallMood } from "../../service/mood.service";

import { useName } from "../../hooks/useName";
import { useProfile } from "../../hooks/useProfile";

const Dashboard = () => {
  const navigate = useNavigate();

  const [userName] = useName();
  const { profileImg } = useProfile();

  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [streak, setStreak] = useState(0);
  const [moodSummary, setMoodSummary] = useState({
    Happy: 0,
    Calm: 0,
    Neutral: 0,
    Sad: 0,
  });

  const [deleteModel, setDeleteModel] = useState({
    show: false,
    journalId: null,
    title: "",
    requireAdmin: false,
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchAll = async () => {
    try {
      setJournals([]);
      setFilteredJournals([]);
      setMoodSummary({ Happy: 0, Calm: 0, Neutral: 0, Sad: 0 });
      setStreak(0);

      const [journalResp, streakResp, moodResp] = await Promise.all([
        getAllJournals(),
        myStreak(),
        overallMood(),
      ]);

      const journalArray = journalResp;
      setJournals(journalArray);
      setFilteredJournals(journalArray);
      setStreak(streakResp?.streak || 0);

      setMoodSummary({
        Happy: parseFloat(moodResp?.Happy) || 0,
        Calm: parseFloat(moodResp?.Calm) || 0,
        Neutral: parseFloat(moodResp?.Neutral) || 0,
        Sad: parseFloat(moodResp?.Sad) || 0,
      });
    } catch {
      showToast("Failed to load dashboard data", "error");
    }
  };


useEffect(() => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("access_token");

  if (!token) {
    navigate("/");
    return;
  }

  if (!userId || userId === "undefined") {
    console.warn("UserID missing, but token exists. Attempting recovery...");
    setTimeout(() => fetchAll(), 500); 
    return;
  }

  fetchAll();
}, [navigate]); 

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = journals.filter(
      (j) =>
        j.title?.toLowerCase().includes(term) ||
        j.content?.toLowerCase().includes(term)
    );

    setFilteredJournals(filtered);
  };

  const weeklyStats = useMemo(() => {
    if (!Array.isArray(journals))
      return { total: 0, thisWeek: 0, topMood: "Mostly calm" };

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const thisWeekCount = journals.filter((j) => {
    const jDate = new Date(j.journal_date || j.journalDate);
    return jDate >= lastWeek;
  }).length;

    const moodCount = {};

    journals.forEach((j) => {
      if (j.mood) {
        const mood =
          j.mood.charAt(0).toUpperCase() + j.mood.slice(1).toLowerCase();
        moodCount[mood] = (moodCount[mood] || 0) + 1;
      }
    });

    const topMood =
      Object.keys(moodCount).length > 0
        ? Object.keys(moodCount).reduce((a, b) =>
            moodCount[a] > moodCount[b] ? a : b
          )
        : "Mostly calm";

    return { total: journals.length, thisWeek: thisWeekCount, topMood };
  }, [journals]);

  const moodPercentages = useMemo(() => {
    const totalMoods =
      Object.values(moodSummary).reduce(
        (sum, val) => sum + (Number(val) || 0),
        0
      ) || 1;

    return Object.fromEntries(
      Object.entries(moodSummary).map(([label, count]) => [
        label,
        ((Number(count) || 0) / totalMoods) * 100,
      ])
    );
  }, [moodSummary]);

  const moodEmojis = {
    Happy: "😍",
    Calm: "😊",
    Neutral: "😐",
    Sad: "😢",
  };

  const confirmDelete = (journalId, title) => {
    setDeleteModel({
      show: true,
      journalId,
      title,
      requireAdmin: false,
    });
  };

  const handleDelete = async (adminKey) => {
    const { journalId, requireAdmin } = deleteModel;
    if (!journalId) return;

    try {

      if (requireAdmin) {
        const userId = localStorage.getItem("userId");
        await adminDeleteJournal(userId, journalId, adminKey);
      } else {
        await deleteJournal(journalId);
      }

      showToast("Journal deleted successfully");
      fetchAll();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteModel({
        show: false,
        journalId: null,
        title: "",
        requireAdmin: false,
      });
    }
  };
  return (
    <div className="dashboard-container">
      <Sidebar />
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName || "User"},</p>
            <h1>Welcome to Notevia!</h1>
          </div>

          <div className="search-bar-container">
            <div className="search-wrapper">
              <img src={SeaarchIcon} alt="search" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="profile-sec" onClick={() => navigate("/profile")}>
            <div className="profile-circle">
              <img className={!profileImg ? "default-icon" : ""}  src={profileImg || ProImg} alt="profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-icon-wrapper" style={{ backgroundColor: "#4318FF" }}>
                <img src={IconJournal} alt="journals" />
              </div>
              <div>
                <span className="label">Total Journals</span>
                <span className="value">{weeklyStats.total}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-icon-wrapper" style={{ backgroundColor: "#4318FF" }}>
                <img src={IconStreak} alt="week" />
              </div>
              <div>
                <span className="label">This Week</span>
                <span className="value">{weeklyStats.thisWeek}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-icon-wrapper">
                <img src={IconWeek} alt="streak" />
              </div>
              <div>
                <span className="label">Streak</span>
                <span className="value">{streak} Days</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-mood-gradient">
            <div className="stat-info">
              <div>
                <span className="label">Mood Status</span>
                <span className="value">{weeklyStats.topMood}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboardbtns">
          <button className="newbtn" onClick={() => navigate('/create')}> + New Journal</button>
          <button className="allbtn" onClick={() => navigate('/journals')}>View All Journals</button>
        </div>

        {/* Dashboard Body: Journals Left / Mood Right */}
        <div className="dashboard-body">
          {/* Left: Recent Journals */}
          <div className="recent-journals-section">
            <h2 className="heading">Recent Journals</h2>
               <section className="dashboard-section-grid">
                 {filteredJournals.map((journal, index) => {
                   const journalId = journal._id || journal.id || index;
                   const moodEmoji =
                       journal.mood === "Happy"
                         ? "😊 Happy"
                         : journal.mood === "Sad"
                         ? "😔 Sad"
                         : journal.mood === "Neutral"
                         ? "😐 Neutral"
                         : "😌 Calm";
       
                     return (
                       <div key={journalId} className="journal-item-grid">
                         <div className="card-top">
                           <h3>{journal.title || "Untitled"}</h3>
                           <span className="mood-tag">{moodEmoji}</span>
                         </div>
                         <p className="card-date">
                           {journal.journal_date
                             ? new Date(journal.journal_date).toLocaleDateString()
                             : new Date().toLocaleDateString()}
                         </p>
                         <p className="card-text">
                           "{journal.content?.substring(0, 60)}..."
                         </p>
                         <div className="card-actions">
                           <button
                             className="action-btn"
                             onClick={() => navigate(`/journal/${journalId}`)}
                           >
                             <img src={EyeIcon} alt="View" />
                           </button>
                           <button
                             className="action-btn"
                             onClick={() => navigate(`/create/${journalId}`)}
                           >
                             <img src={EditIcon} alt="Edit" />
                           </button>
                           <button
                             className="action-btn"
                             onClick={() => confirmDelete(journalId, journal.title)}
                           >
                             🗑️
                           </button>
                         </div>
                       </div>
                   );
                   })}
               </section>
          </div>

          {/* Right: Mood Summary */}
          <div className="mood-summary-sidebar">
            <h2 className="heading">Mood Summary</h2>
            <div className="mood-list">
              {Object.entries(moodPercentages).map(([label, percent]) => (
                <MoodProgress
                key={label} label={label} percentage={percent} color="#4318ff" emoji={moodEmojis[label]} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <AdminDelJournal
        show={deleteModel.show}
        onClose={() => setDeleteModel({ show: false, journalId: null, title: "", requireAdmin: false })}
        onDelete={handleDelete}
        journalTitle={deleteModel.title}
        requireAdmin={deleteModel.requireAdmin}
      />
    </div>
  );
};

export default Dashboard;