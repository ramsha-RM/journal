import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Sidebar from '../journal/Sidebar';
import '../../style/dashboardstyle/profile.css';
import '../../style/dashboardstyle/dashboardLayout.css'
import Toast from '../../components/Toast'
import API from '@/service/axios'
import ProfileImg from '../../assets/icons/profile.png';
import UserImg from '../../assets/icons/profile-edit.svg'

const Profile = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get('/profiles/me');
      const data = res.data;

      const names = data.full_name ? data.full_name.split(" ") : ["", ""];
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");
      setBio(data.bio || "");
      setDob(data.date_of_birth || "");
      setProfilePic(data.profile_picture || "");
     
      setEmail(data.email || localStorage.getItem('email') || "");
      
      setUserName(data.username || localStorage.getItem('username') || "User");
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response && error.response.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
        localStorage.clear();
        navigate('/');
      } else {
       setMessage({ type: 'error', text: 'Failed to load profile' });
     }
    } finally {
      setLoading(false);
    }
    };
    fetchProfile(); 
  }, [navigate]);

    useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(null), 3000); 
    return () => clearTimeout(timer);
  }
}, [message]);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

const handleSave = async () => {
  if (!firstName || !lastName || !bio) {
    setMessage({ type: 'error', text: 'All fields are required!' });
    return;
  }

  try {
    setLoading(true);
    const body = {
      full_name: `${firstName} ${lastName}`,
      bio,
      profile_picture: profilePic || ""
    };
    // axios interceptor will automatically attach the access token
    await API.patch('/profiles/me', body);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
  } catch (err) {
    console.error("Failed to save profile:", err.response?.data || err);
    setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile!' });
  } finally {
    setLoading(false);
  }
};

  return (
<div className="dashboard-container">
      <Sidebar />
    <Toast show={!!message} message={message?.text} type={message?.type} />
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
  <input type="text" value={`${firstName} ${lastName}`.trim()} onChange={(e) => {
    const names = e.target.value.split(' ');
    setFirstName(names.shift() || "");
    setLastName(names.join(' ') || "");
  }} placeholder="Full Name" /></div>

  <div className="emailbox">
    <label htmlFor="email">Email</label>
  <input type="email" value={email} readOnly placeholder={email}/>
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
