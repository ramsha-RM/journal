import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../../service/api.interceptor';
import "../../style/AuthStyle/resetPassword.css" 

import ShowHidePass from '../../components/ShowHidePass';

const ChangePassword = () => {
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [message, setMessage] = useState(null);


const handlePassword = async (e) => {
  e.preventDefault();
  setMessage(null);

  if (loading) return;

  if (!currentPassword || currentPassword.length < 6) {
    setMessage({ type: "error", text: "Current password must be at least 6 characters!" });
    return;
  }

  if (!newPassword || newPassword.length < 6) {
    setMessage({ type: "error", text: "New password must be at least 6 characters!" });
    return;
  }

  if (currentPassword === newPassword) {
    setMessage({ type: "error", text: "New password must be different from current password!" });
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage({ type: "error", text: "Passwords do not match!" });
    return;
  }

  try {
    setLoading(true);

    await API.post("/auth/change-password", {  
      currentPassword,
      newPassword
    });

    setMessage({ type: "success", text: "Password updated successfully!" });
    setCurrentPassword("");
    setCurrentPassword("");
    setNewPassword("");
    
    setTimeout(() => navigate("/dashboard"), 2000);

  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        setMessage({ type: "error", text: "Session expired. Please login again." });
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response.status === 403) {
        setMessage({ type: "error", text: "Current password is incorrect!" });
      } else {
        setMessage({ type: "error", text: "Server error. Try again later." });
      }
    } else {
      setMessage({ type: "error", text: "Network error. Check your connection!" });
    }
  } finally {
    setLoading(false);
  }
    };

  return (
    <div className="auth-wrapper">
      <form className="modal-content resetForm" onSubmit={handlePassword}>
        <h2 className="pass-heading">Change Password</h2>
        <p className='btext'>Update your password below.</p>

      <div className="input-container" style={{
        display: "flex", flexDirection: "column",  gap: "12px"
      }}>
        <ShowHidePass 
         name="currentPassword"
          label="Current Password" 
          autoCompleteType="current-password"
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
        />
        <ShowHidePass 
          label="New Password" 
          name="newPassword"
          autoCompleteType="new-password"
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <ShowHidePass 
          label="Confirm Password" 
          name="confirmPassword"
          autoCompleteType="new-password"
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
      </div>

        <div className="actionbtn">
          <button type="button" className="clear" onClick={() => navigate("/dashboard")}>Cancel</button>
          <button className='passwordbtn' type='submit' disabled={loading} >{ loading ? "Updating" : "Update" }</button>
        </div>
      </form>

      {message && (
        <div className={`message ${message.type}`}>
          <span>{message.text}</span>
          <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword
