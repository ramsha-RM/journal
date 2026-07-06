import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/DashboardStyle/createJournal.css';
import '../../style/DashboardStyle/dashboardLayout.css';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import { useName } from "../../hooks/useName"; 

import BackbtnImg from '../../assets/icons/Backbtn.png';
import EditIcon from '../../assets/icons/blueedit.png';
import DeleteIcon from '../../assets/icons/redtrash.png';
import CopyIcon from '../../assets/icons/copyicon.png';

import { getSingleJournal, deleteJournal } from '../../service/journal.service';
import AdminDelJournal from '../../components/AdminDelJournal';

const AddJournal = () => {
    const navigate = useNavigate();
    const [userName] = useName();   
    const { id } = useParams();

    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const [deleteModel, setDeleteModel] = useState({ 
        show: false, 
        title: "", 
        requireAdmin: false 
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const moodEmojis = { 
        Happy: "😄", 
        Calm: "😌", 
        Neutral: "😐", 
        Sad: "😔" 
    };

    useEffect(() => {
        if (!id) {
            navigate('/journals', { replace: true });
            return;
        }

        const fetchJournal = async () => {
            try {
                setLoading(true);
                const data = await getSingleJournal(id);
                setJournal(data);
            } catch (error) {
                const status = error.response?.status;

                if (status === 423) {
                    showToast("Session locked. Please verify your PIN.", "error");
                    localStorage.setItem("pendingRedirectAfterPin", `/journal/${id}`);

                    setTimeout(() => {
                        navigate("/pin/verify", { replace: true });
                    }, 1200);
                } else {
                    showToast("Failed to load journal", "error");
                    setTimeout(() => navigate('/journals', { replace: true }), 1500);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJournal();
    }, [id, navigate]);

    const handleEdit = () => navigate(`/create/${id}`);

    const confirmDelete = () => {
        setDeleteModel({
            show: true,
            title: journal?.title || "this journal",
            requireAdmin: false 
        });
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteJournal(id);
            showToast('Journal deleted successfully', 'success');
            setDeleteModel({ show: false, title: "", requireAdmin: false });
            setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
        } catch (error) {
            if (error.response?.status === 423) {
                showToast("Session locked. Please verify your PIN.", "error");
                localStorage.setItem("pendingRedirectAfterPin", `/journal/${id}`);
                setTimeout(() => navigate("/pin/verify", { replace: true }), 1000);
            } else {
                showToast('Delete failed', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (journal?.content) {
            navigator.clipboard.writeText(journal.content);
            showToast('Journal copied to clipboard', 'success');
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
      </header>

      <div className="added-journal-container">

        <div className="upper-box">
          <div
            className="newJournal-btn"
            onClick={() => navigate("/dashboard")}
          >
            <img src={BackbtnImg} alt="Back" />
            <span>Back</span>
          </div>

          <div className="action-btns">
            <button onClick={handleEdit} disabled={loading}>
              <img src={EditIcon} alt="" />
              Edit
            </button>

            <button onClick={confirmDelete} disabled={loading}>
              <img src={DeleteIcon} alt="" />
              Delete
            </button>
          </div>
        </div>

        <div className="journalBox">

          {loading ? (
            <>
              <div className="top-box">
                <div>
                  <Skeleton width="160px" height="16px" />
                  <Skeleton width="110px" height="10px" />
                </div>
                <Skeleton width="70px" height="14px" />
              </div>

              <hr />

              <div className="textarea-box">
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </div>
            </>
          ) : (
            <>
              <div className="top-box">
                <div>
                  <h2>{journal?.title || "New Beginning"}</h2>
                  <p>
                    {journal?.journal_date
                      ? new Date(journal.journal_date).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </p>
                </div>

                <span>
                  {journal?.mood
                    ? `${moodEmojis[journal.mood]} ${journal.mood}`
                    : "😄 Happy"}
                </span>
              </div>

              <hr />

              <div className="textarea-box">
                <p>
                  {journal?.content?.trim()
                    ? journal.content
                    : "No content available."}
                </p>
              </div>

              {journal?.content && (
                <img
                  src={CopyIcon}
                  alt="copy"
                  className="copy-icon"
                  onClick={handleCopy}
                />
              )}
            </>
          )}

        </div>
      </div>
    </main>

    <AdminDelJournal
      show={deleteModel.show}
      onClose={() =>
        setDeleteModel((prev) => ({ ...prev, show: false }))
      }
      onDelete={handleDelete}
      journalTitle={deleteModel.title}
      requireAdmin={deleteModel.requireAdmin}
    />
  </div>
);
};

export default AddJournal;