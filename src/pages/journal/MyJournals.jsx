import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "../../components/Toast";
import AdminDelJournal from "../../components/AdminDelJournal";
import Skeleton from "../../components/Skeleton";

import "../../style/dashboardstyle/dashboard.css";
import "../../style/dashboardstyle/dashboardLayout.css";

import SeaarchIcon from "../../assets/icons/searchicon.png";
import ProImg from "../../assets/icons/profile.png";
import EyeIcon from "../../assets/icons/eye.png";
import EditIcon from "../../assets/icons/penciledit.png";

import {
  getAllJournals,
  deleteJournal,
  adminDeleteJournal,
} from "../../service/journal.service";

import { useName } from "../../hooks/useName";
import { useProfile } from "../../hooks/useProfile";

const MyJournals = () => {
  const navigate = useNavigate();

  const [userName] = useName();
  const { profileImg } = useProfile();

  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [deleteModel, setDeleteModel] = useState({
    show: false,
    journalId: null,
    title: "",
    requireAdmin: false,
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await getAllJournals();
      setJournals(data);
      setFilteredJournals(data);
    } catch {
      showToast("Failed to fetch journals", "error");
    } finally {
      setLoading(false);
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
      fetchJournals();
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
              <Skeleton width="100%" height="45px" />
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
                <img
                  className={!profileImg ? "default-icon" : ""}
                  src={profileImg || ProImg}
                  alt="profile"
                />
                )}
              </div>
            </div>
          </div>
        </header>
        {loading ? (
              <Skeleton width="20%" height="30px" style={{ marginBottom: "20px" }} />
            ) : (
        <h3 className="heading">My Journals</h3>
            )}
        <section className="journals-section-grid">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height="120px" />
              ))
          ) : filteredJournals.length === 0 ? (
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
                      ? new Date(
                          journal.journal_date
                        ).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </p>

                  <p className="card-text">
                    "{journal.content?.substring(0, 60)}..."
                  </p>

                  <div className="card-actions">
                    <button
                      className="action-btn"
                      onClick={() =>
                        navigate(`/journal/${journalId}`)
                      }
                    >
                      <img src={EyeIcon} alt="View" />
                    </button>

                    <button
                      className="action-btn"
                      onClick={() =>
                        navigate(`/create/${journalId}`)
                      }
                    >
                      <img src={EditIcon} alt="Edit" />
                    </button>

                    <button
                      className="action-btn"
                      onClick={() =>
                        confirmDelete(journalId, journal.title)
                      }
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

      <AdminDelJournal
        show={deleteModel.show}
        onClose={() =>
          setDeleteModel({
            show: false,
            journalId: null,
            title: "",
            requireAdmin: false,
          })
        }
        onDelete={handleDelete}
        journalTitle={deleteModel.title}
        requireAdmin={deleteModel.requireAdmin}
      />
    </div>
  );
};

export default MyJournals;