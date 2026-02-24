import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Sidebar from '../journal/Sidebar';
import '../../style/dashboardstyle/profile.css';
import '../../style/dashboardstyle/dashboardLayout.css'
import API from '@/service/axios'
import ProfileImg from '../../assets/icons/profile.png';
import UserImg from '../../assets/icons/profile-edit.svg'

const Profile = () => {
  const navigate = useNavigate();
  const [profilePic, SetprofilePic] = useState('');
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const storedUserName = localStorage.getItem('username');
  const storedEmail = localStorage.getItem('email');
    if (storedUserName) setUserName(storedUserName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(null), 3000); 
    return () => clearTimeout(timer);
  }
}, [message]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

const handleSave = async () => {

  if(!firstName || !lastName || !bio){
    setMessage({type: 'error', text: 'All fields are required!'});
    return;
  }

    try {
      setLoading(true);

      const loginToken = localStorage.getItem('login_token');

      await API.patch('/profiles/me', {
     first_name: firstName,
    //  last_name: lastName,
    //  date_of_birth: dob,
     bio: bio,
     profile_picture: profilePic
      },{
        headers: {
          Authorization: `Bearer ${loginToken}`
        }
      }
    )
      setMessage({type: 'success', text: 'Profile updated successfully!'});
      setLoading(false);
    } catch (error) {
      console.error("Error saving profile:", error);
       setMessage({type:'error', text:'Failed to save profile!'});
    }finally{
      setLoading(false);
    }
  }

  return (
<div className="dashboard-container">
      <Sidebar />
    {message && (
  <div className={`toast-box ${message.type}`}>
    <span className="toast-icon">{message.type === 'error' ? '⚠️' : '✅'}</span>
    {message.text}
  </div>
)}
      <main className="main-content">
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName},</p>
            <h1>Welcome to Notevia!</h1>
          </div>

            <div className="profile-circle">
              <img src={ProfileImg} alt="Profile" />
            </div>
        </header>
    <div className="profile-box">
      <h3 className="heading">Profile</h3>
        <div className="profile-form">
      <div className="userdata">
        <div className="edit-img">
        <img src={UserImg} alt="Profile" /></div>
        <div className="username-date">
          <p className="username">{userName}</p>
          <p className="joineddate">Joined Jan 2026</p>
        </div>
      </div>
          <div className="name-email">
    <div className="namebox">
      <label htmlFor="name">Full Name</label>
  <input type="text" value={`${firstName} ${lastName}`} onChange={(e) => {
    const names = e.target.value.split(' ');
    setFirstName(names[0] || "");
    setLastName(names[1] || "");
  }} placeholder="Full Name" /></div>
  <div className="emailbox">
    <label htmlFor="email">Email</label>
  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
   placeholder={email}/>
  </div></div>
  <div className="textareabox">
    <label>Bio</label>
  <textarea value={bio} onChange={(e) => setBio(e.target.value)}
   placeholder="Passionate about creating, learning, and building meaningful experiences."></textarea>
</div>
<div className="profile-buttons">
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
  <button className="change-pass-btn" onClick={() => navigate('/password/change')}>Change Password</button>
  <button className="save-btn" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
</div></div></div>
    </main>
  </div>
  )
}

export default Profile
