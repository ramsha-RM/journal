import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "../../components/Toast";
import AdminDelJournal from "../../components/AdminDelJournal";
import "../../style/dashboardstyle/dashboard.css";
import "../../style/dashboardstyle/dashboardLayout.css";

import SeaarchIcon from "../../assets/icons/searchicon.png";
import ProfileImg from "../../assets/icons/profile.png";
import IconJournal from "../../assets/icons/edit.png";
import IconWeek from "../../assets/icons/vector.png";
import IconStreak from "../../assets/icons/Vectorjournal.png";
import EyeIcon from "../../assets/icons/eye.png";

import { getAllJournals, deleteJournal, adminDeleteJournal } from "../../service/journal.service";
import { myStreak } from "../../service/streak.service";
import { overallMood } from "../../service/mood.service";
import { dashboardStats } from "../../service/dashboard.service";

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("User");
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [streak, setStreak] = useState(0);
  const [moodSummary, setMoodSummary] = useState({ Happy: 0, Calm: 0, Neutral: 0, Sad: 0 });
  const [stats, setStats] = useState(null);
  const [deleteModel, setDeleteModel] = useState({ show: false, journalId: null, title: "", requireAdmin: false });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [journalResp, streakResp, moodResp, dashboardResp] = await Promise.all([
        getAllJournals(),
        myStreak(),
        overallMood(),
        dashboardStats(),
      ]);

      const journalArray = journalResp?.journals || journalResp?.data || [];
      setJournals(journalArray);
      setFilteredJournals(journalArray);

      setStreak(streakResp?.streak || 0);
      setMoodSummary(moodResp || {});
      setStats(dashboardResp || null);
    } catch {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const savedName = localStorage.getItem("username");
    setUserName(savedName && savedName !== "undefined" ? savedName : "User");
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredJournals(
      journals.filter(
        (j) => j.title?.toLowerCase().includes(term) || j.content?.toLowerCase().includes(term)
      )
    );
  };

  const weeklyStats = useMemo(() => {
    if (!Array.isArray(journals)) return { total: 0, thisWeek: 0, topMood: "N/A" };
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const thisWeekCount = journals.filter((j) => new Date(j.journal_date) >= lastWeek).length;

    const moodCount = {};
    journals.forEach((j) => {
      if (j.mood) moodCount[j.mood] = (moodCount[j.mood] || 0) + 1;
    });

    const topMood =
      Object.keys(moodCount).length > 0
        ? Object.keys(moodCount).reduce((a, b) => (moodCount[a] > moodCount[b] ? a : b))
        : "N/A";

    return { total: journals.length, thisWeek: thisWeekCount, topMood };
  }, [journals]);

  const confirmDelete = (journalId, title) => {
    setDeleteModel({ show: true, journalId, title, requireAdmin: false });
  };

  const handleDelete = async (adminKey) => {
    const { journalId, requireAdmin } = deleteModel;
    if (!journalId) return;

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const moodEmojis = { Happy: "😊", Calm: "😌", Neutral: "😐", Sad: "😔" };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName},</p>
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
            <div className="profile-circle" onClick={() => navigate("/profile")}>
              <img src={ProfileImg} alt="profile" />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-icon-wrapper">
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
              <div className="stat-icon-wrapper">
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

        {/* Dashboard Body: Journals Left / Mood Right */}
        <div className="dashboard-body">
          {/* Left: Recent Journals */}
          <div className="recent-journals-section">
            <h2>Recent Journals</h2>
            {filteredJournals.slice(0, 4).map((journal) => (
              <div className="journal-item-card" key={journal._id}>
                <div className="card-top">
                  <h3>{journal.title || "Untitled"}</h3>
                  <p className="card-date">{journal.journal_date?.slice(0, 10)}</p>
                </div>
                <div className="card-text">{journal.content}</div>
                <div className="card-actions">
                  <button
                    className="action-btn"
                    onClick={() => navigate(`/journal/${journal._id}`)}
                  >
                    <img src={EyeIcon} alt="view" />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => confirmDelete(journal._id, journal.title)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Mood Summary */}
          <div className="mood-summary-sidebar">
            <h2>Mood Summary</h2>
            <div className="mood-list">
              {Object.entries(moodSummary).map(([label, value]) => (
                <div className="progress-container" key={label}>
                  <div className="emoji-col">{moodEmojis[label]}</div>
                  <div className="content-col">
                    <div className="text-row">
                      <span>{label}</span>
                      <span>{parseInt(value) || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${parseInt(value) || 0}%`, background: "#4318FF" }}
                      />
                    </div>
                  </div>
                </div>
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