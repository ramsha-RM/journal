import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../style/dashboardstyle/createjournal.css';
import '../../style/dashboardstyle/dashboardLayout.css'
import Toast from '../../components/Toast'

import BackbtnImg from '../../assets/icons/Backbtn.png';
import EditIcon from '../../assets/icons/blueedit.png';
import DeleteIcon from '../../assets/icons/redtrash.png';
import CopyIcon from '../../assets/icons/copyicon.png';

import { useParams } from 'react-router-dom';
import { getSingleJournal, deleteJournal, adminDeleteJournal } from '../../service/journal.service';

const AddJournal = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [userName, setUserName] = useState('User');
    const [deleteModel, setDeleteModel] = useState({ show: false, journalId: null, title: "", requireAdmin: false });
      const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };
    const moodEmojis = { Happy: "😄", Calm: "😌", Neutral: "😐", Sad: "😔" }
    
    useEffect(() => {
  const savedName = localStorage.getItem('username');
  setUserName(savedName && savedName !== 'undefined' ? savedName : "User");
}, []);

    useEffect(() => {
      if (!id) {
        showToast('Journal ID missing in URL', 'error');
        navigate('/journals');
        return;
      }
       const fetchJournal = async () => {
      try {
        const data = await getSingleJournal(id);
        setJournal(data);
      } catch (err) {
        console.error(err);
        showToast('Failed to load journal', 'error');
      }
    };

    fetchJournal();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/create/${id}`);
  };


    const handleDelete = async () => {
    if (!id) return;

    try {
      setLoading(true);
      await deleteJournal(id); // for admin, use adminDeleteJournal if needed
      showToast('Journal deleted successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
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
    const dummyText = ` Today marks the start of a new chapter. I decided to take journaling seriously as a tool for self-reflection and mental clarity.
            Writing helps me organize my thoughts and process emotions in a healthy way. Here's to showing up for myself every day.Spent the entire day indoors reading and journaling.
            Made some hot chocolate and listened to lo-fi music. Days like these are necessary for recharging. I didn't accomplish anything productive in the traditional sense, but I feel more at peace than I have in weeks.
            Today marks the start of a new chapter. I decided to take journaling seriously as a tool for self-reflection and mental clarity. Writing helps me organize my thoughts and process emotions in a healthy way.
            Here's to showing up for myself every day.Spent the entire day indoors reading and journaling. Made some hot chocolate and listened to lo-fi music. Days like these are necessary for recharging.
            I didn't accomplish anything productive in the traditional sense, but I feel more at peace than I have in weeks.`;

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
        </header>
        
        <div className="added-journal-container">
          <div className="upper-box">
            <div className="newJournal-btn"><img src={BackbtnImg} alt="Back Button" 
            onClick={() => navigate('/dashboard')} />
            <span>New Journals</span></div>
            <div className="action-btns">
            <button className="edit-btn" onClick={handleEdit} disabled={loading}><img src={EditIcon} alt="Edit" /> Edit</button>   
            <button className="del-btn" onClick={handleDelete}><img src={DeleteIcon} alt="Delete" /> Delete</button>   
            </div></div>
            <div className="journalBox">
           <div className="top-box">
            <div className="heading-date">
            <h2 className='journal-title'>{journal?.title || "New Beginning"}</h2>
          <p className="date">{journal?.journal_date ? new Date(journal.journal_date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"}) : new Date().toLocaleDateString()}</p></div>
            <p className="mood">{journal?.mood ? `${moodEmojis[journal.mood] || "😌"} ${journal.mood}` : "Happy"}</p></div> 
        <hr />
        <div className="textarea-box">
            <p className="journal-text">{journal?.content?.trim() ? journal.content : dummyText}</p>
           </div>
           {journal?.content && (<img src={CopyIcon} alt="Copy" className="copy-icon"
           onClick={handleCopy} />)}
        </div>
      </div> 
    </main>
    </div>
  )
}

export default AddJournal
