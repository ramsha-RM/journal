import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "../../components/Toast";
import AdminDelJournal from "../../components/AdminDelJournal";
import MoodProgress from "../../components/MoodProgress";
import Skeleton from "../../components/Skeleton";

import "../../style/DashboardStyle/dashboard.css";
import "../../style/DashboardStyle/dashboardLayout.css";

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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const [journalResp, streakResp, moodResp] = await Promise.all([
        getAllJournals(),
        myStreak(),
        overallMood(),
      ]);

      setJournals(journalResp || []);
      setFilteredJournals(journalResp || []);
      setStreak(streakResp?.streak || 0);
      setMoodSummary({
        Happy: parseFloat(moodResp?.Happy) || 0,
        Calm: parseFloat(moodResp?.Calm) || 0,
        Neutral: parseFloat(moodResp?.Neutral) || 0,
        Sad: parseFloat(moodResp?.Sad) || 0,
      });
    } catch {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
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
    if (!Array.isArray(journals) || journals.length === 0)
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
        const mood = j.mood.charAt(0).toUpperCase() + j.mood.slice(1).toLowerCase();
        moodCount[mood] = (moodCount[mood] || 0) + 1;
      }
    });

    const topMood = Object.keys(moodCount).length > 0
      ? Object.keys(moodCount).reduce((a, b) => (moodCount[a] > moodCount[b] ? a : b))
      : "Mostly calm";

    return { total: journals.length, thisWeek: thisWeekCount, topMood };
  }, [journals]);

  const moodPercentages = useMemo(() => {
    const totalMoods = Object.values(moodSummary).reduce((sum, val) => sum + (Number(val) || 0), 0) || 1;
    return Object.fromEntries(
      Object.entries(moodSummary).map(([label, count]) => [
        label,
        ((Number(count) || 0) / totalMoods) * 100,
      ])
    );
  }, [moodSummary]);

  const moodEmojis = { Happy: "😍", Calm: "😊", Neutral: "😐", Sad: "😢" };

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
      setDeleteModel({ show: false, journalId: null, title: "", requireAdmin: false });
    }
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

          <div className="search-bar-container">
            {loading ? (
              <Skeleton width="100%" height="20px" borderRadius="10px" />
            ) : (
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
            )}
            <div className="profile-sec" onClick={() => navigate("/profile")}>
              <div className="profile-circle">
              {loading ? (
          <Skeleton width="100%" height="100%" borderRadius="50%" />
               ) : (
                <img className={!profileImg ? "default-icon" : ""} src={profileImg || ProImg} alt="profile" />
                )}
              </div>
            </div>
          </div>
        </header>
       <div className="stats-grid">
         {[
           { label: "Total Journals", value: weeklyStats.total, icon: IconJournal, color: "#4318FF" },
           { label: "This Week", value: weeklyStats.thisWeek, icon: IconStreak, color: "#4318FF" },
           { label: "Streak", value: `${streak} Days`, icon: IconWeek, color: "transparent" },
           { label: "Mood Status", value: weeklyStats.topMood, icon: null, color: "gradient" }
         ].map((stat, idx) => (
         <div 
           key={idx} 
           className={`stat-card ${(!loading && stat.color === 'gradient') ? 'stat-mood-gradient' : ''}`}
         >
           <div className="stat-info">
             {loading ? (
             <div className="skeleton-stat-wrapper">
                <Skeleton width="100%" height="45px" borderRadius="8px" />
             </div>
           ) : (
             <>
               {stat.icon && (
                   <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color !== 'gradient' ? stat.color : '' }}>
                  <img src={stat.icon} alt={stat.label} />
                </div>
                )}
                <div>
                  <span className="label">{stat.label}</span>
                        <span className="value">{stat.value}</span>
                    </div>
                  </>
                )}
            </div>
          </div>
        ))}
      </div>

          <div className="dashboardbtns">
         {loading ? (
         <>
        <Skeleton width="150px" height="45px" borderRadius="70px" />
        <Skeleton width="180px" height="45px" borderRadius="70px" style={{ marginLeft: "12px" }} />
        </>
        ) : (
       <>
      <button className="newbtn" onClick={() => navigate('/create')}> + New Journal</button>
      <button className="allbtn" onClick={() => navigate('/journals')}>View All Journals</button>
    </>
  )}
</div>

        <div className="dashboard-body">
          <div className="recent-journals-section">
            {loading ? (
              <Skeleton width="20%" height="30px" style={{ marginBottom: "30px" }} />
            ) : (
            <h2 className="heading">Recent Journals</h2>
            )}
            <section className="dashboard-section-grid">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="journal-item-grid">
                    <Skeleton width="80%" height="24px" />
                    <Skeleton width="40%" height="16px" style={{ margin: "8px 0" }} />
                    <Skeleton width="100%" height="40px" />
                  </div>
                ))
              ) : (
                filteredJournals.map((journal, index) => {
                  const journalId = journal._id || journal.id || index;
                  const moods = { Happy: "😊 Happy", Sad: "😔 Sad", Neutral: "😐 Neutral", Calm: "😌 Calm" };
                  return (
                    <div key={journalId} className="journal-item-grid">
                      <div className="card-top">
                        <h3>{journal.title || "Untitled"}</h3>
                        <span className="mood-tag">{moods[journal.mood] || "😌 Calm"}</span>
                      </div>
                      <p className="card-date">
                        {journal.journal_date ? new Date(journal.journal_date).toLocaleDateString() : new Date().toLocaleDateString()}
                      </p>
                      <p className="card-text">"{journal.content?.substring(0, 60)}..."</p>
                      <div className="card-actions">
                        <button className="action-btn" onClick={() => navigate(`/journal/${journalId}`)}>
                          <img src={EyeIcon} alt="View" />
                        </button>
                        <button className="action-btn" onClick={() => navigate(`/create/${journalId}`)}>
                          <img src={EditIcon} alt="Edit" />
                        </button>
                        <button className="action-btn" onClick={() => setDeleteModel({ show: true, journalId, title: journal.title, requireAdmin: false })}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>

          <div className="mood-summary-sidebar">
            {loading ? (
              <Skeleton width="100%" height="30px" style={{ marginBottom: "20px" }} />
            ) : (
            <h2 className="heading">Mood Summary</h2>
            )}
            <div className="mood-list">
              {loading ? (
                [...Array(4)].map((_, i) => <Skeleton key={i} width="100%" height="30px" style={{ marginBottom: "15px" }} />)
              ) : (
                Object.entries(moodPercentages).map(([label, percent]) => (
                  <MoodProgress key={label} label={label} percentage={percent} color="#4318ff" emoji={moodEmojis[label]} />
                ))
              )}
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