import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useName  } from '../../hooks/useName'
import { useAuthLock } from '../../hooks/useAuthLock'
import Sidebar from '../journal/Sidebar'
import LogoutMsg from '../../components/LogoutMsg'
import Toast from '../../components/Toast'
import "../../style/DashboardStyle/dashboardLayout.css";
import "../../style/DashboardStyle/setting.css"


const Setting = () => {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [preferences, setPreferences] = useState(localStorage.getItem("app_lock") || "off");
    const [userName] = useName();
    const [message, setMessage] = useState(null);

    useAuthLock(preferences);
    useEffect(() => {
        localStorage.setItem("app_lock", preferences);
    }, [preferences]);

    const handleLogout = () => {
      localStorage.clear();
      navigate('/');
    }
  return (
    <div className='dashboard-container'>
      <Sidebar />
           {message && (
        <Toast
          show={true}
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)} /> )}

        <LogoutMsg show={showLogout} onConfirm={handleLogout} onCancel={() => setShowLogout(false)}/>
      <div className='main-content'>

        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName || "User"},</p>
            <h1>Welcome to Notevia!</h1>
          </div>
        </header>
        <main className="setting-box">
        <h2 className="headingSetting">Settings</h2>
       <div className="card">

        <div className="setting-item" onClick={() => navigate('/appLock')}>
      <div className="setting-text">
        <h3>App Lock</h3>
        <p>Guard your thoughts with a PIN</p>
      </div>
      <span className="arrow">›</span>
    </div>
   
    <div className="setting-item">
      <div className="setting-text">
        <h3>Account</h3>
        <p>Manage your profile and email</p>
      </div>
      <span className="arrow">›</span>
    </div>
            
    <div className="setting-item">
      <div className="setting-text">
        <h3>Display</h3>
        <p>Switch between Light and Dark mode</p>
      </div>
      <span className="arrow">›</span>
    </div>
   
    <div className="setting-item">
      <div className="setting-text">
        <h3>Backup & Export</h3>
        <p>Download your journal entries as PDF/JSON</p>
      </div>
      <span className="arrow">›</span>
    </div>

    <div className="setting-item">
      <div className="setting-text">
        <h3>Help & Support</h3>
        <p>FAQs and contact info</p>
      </div>
      <span className="arrow">›</span>
    </div>
    </div>
        </main>
      </div>
    </div>
    )
}

export default Setting
