import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "../../components/Toast";
import "../../style/dashboardstyle/dashboard.css";
import "../../style/dashboardstyle/dashboardLayout.css";

import SeaarchIcon from "../../assets/icons/searchicon.png";
import ProfileImg from "../../assets/icons/profile.png";
import EyeIcon from "../../assets/icons/eye.png";
import EditIcon from "../../assets/icons/penciledit.png";
import { getAllJournals, deleteJournal } from "../../service/journal.service";

const MyJournals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchJournals = async () => {
    try {
      const data = await getAllJournals();
      const journalArray = data?.journals || data?.data || (Array.isArray(data) ? data : []);
      setJournals(journalArray);
      setFilteredJournals(journalArray);
    } catch (err) {
      showToast("Failed to fetch journals", "error");
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

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

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this journal?")) return;
    try {
      await deleteJournal(id);
      showToast("Journal deleted successfully");
      fetchJournals();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const userName = localStorage.getItem("username") || "User";

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName},</p>
            <h1>My Journals</h1>
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

        {/* Journals Grid */}
        <section className="journals-section-grid">
          {filteredJournals.length === 0 ? (
            <p style={{ color: "#707EAE" }}>No journals found.</p>
          ) : (
            filteredJournals.map((journal, index) => {
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
                      onClick={() => handleDelete(journalId)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};

export default MyJournals;