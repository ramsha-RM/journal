import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/dashboardstyle/createjournal.css';
import '../../style/dashboardstyle/dashboardLayout.css'
import Toast from '../../components/Toast'
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
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    
    // State for managing the delete confirmation modal
    const [deleteModel, setDeleteModel] = useState({ 
        show: false, 
        title: "", 
        requireAdmin: false 
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const moodEmojis = { Happy: "😄", Calm: "😌", Neutral: "😐", Sad: "😔" };

    useEffect(() => {
        if (!id) {
            navigate('/journals');
            return;
        }
        const fetchJournal = async () => {
            try {
                const data = await getSingleJournal(id);
                setJournal(data);
            } catch {
                showToast('Failed to load journal', 'error');
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
            
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch {
            showToast('Delete failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (journal?.content) {
            navigator.clipboard.writeText(journal.content);
            showToast('Journal copied to clipboard');
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <Toast show={toast.show} message={toast.message} type={toast.type} />

            <main className="main-content">
                <header className="top-header">
                    <div className="welcome-section">
                        <p>Hi {userName || "User"},</p>
                        <h1>Welcome to Notevia!</h1>
                    </div>
                </header>
                
                <div className="added-journal-container">
                    <div className="upper-box">
                        <div className="newJournal-btn" onClick={() => navigate('/dashboard')}>
                            <img src={BackbtnImg} alt="Back" />
                            <span>New Journals</span>
                        </div>
                        <div className="action-btns">
                            <button className="edit-btn" onClick={handleEdit} disabled={loading}>
                                <img src={EditIcon} alt="Edit" /> Edit
                            </button>   
                            
                            <button className="del-btn" onClick={confirmDelete} disabled={loading}>
                                <img src={DeleteIcon} alt="Delete" /> Delete
                            </button>   
                        </div>
                    </div>

                    <div className="journalBox">
                        <div className="top-box">
                            <div className="heading-date">
                                <h2 className='journal-title'>{journal?.title || "New Beginning"}</h2>
                                <p className="date">
                                    {journal?.journal_date ? new Date(journal.journal_date).toLocaleDateString("en-US", {
                                        weekday: "short", year: "numeric", month: "short", day: "numeric"
                                    }) : new Date().toLocaleDateString()}
                                </p>
                            </div>
                            <p className="mood">
                                {journal?.mood ? `${moodEmojis[journal.mood] || "😌"} ${journal.mood}` : "Happy"}
                            </p>
                        </div> 
                        <hr />
                        <div className="textarea-box">
                            <p className="journal-text">
                                {journal?.content?.trim() ? journal.content : "No content available."}
                            </p>
                        </div>
                        {journal?.content && (
                            <img src={CopyIcon} alt="Copy" className="copy-icon" onClick={handleCopy} />
                        )}
                    </div>
                </div> 
            </main>

            <AdminDelJournal
                show={deleteModel.show}
                onClose={() => setDeleteModel({ ...deleteModel, show: false })}
                onDelete={handleDelete} 
                journalTitle={deleteModel.title}
                requireAdmin={deleteModel.requireAdmin}
            />
        </div>
    );
}

export default AddJournal;