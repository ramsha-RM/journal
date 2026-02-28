import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '@/service/axios';
import "../../style/authstyle/resetPassword.css" 
import authBGImg from '../../assets/img/Ractangle.png'

const Changepassword = () => {
const navigate = useNavigate();
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [message, setMessage] = useState(null);


    const handlePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

       if (!currentPassword || currentPassword.length < 6) {
      setMessage({ type: "error", text: "Current password must be at least 6 characters!" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters!" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirm password do not match!" });
      return;
    }
        try {
            await API.post("/auth/change-password", {  
              currentPassword,
              newPassword
         },
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(import.meta.env.VITE_LOGIN_TOKEN_KEY)}`
          }
         }
        );
            setMessage({type: "success", text: "Password changed successfully!" })
           setTimeout(() => {
             navigate("/dashboard");
           }, 2000);
        } catch (error) {
           if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setMessage({ type: "error", text: "Unauthorized. Please login again." });
          setTimeout(() => navigate("/login"), 2000);
        } else if (status === 403) {
          setMessage({ type: "error", text: "Current password is incorrect!" });
        } else {
          setMessage({ type: "error", text: "Server error. Try again later." });
        }
      } else {
        setMessage({ type: "error", text: "Network error. Check your connection!" });
      }
        }
    };

  return (
    <div className="passwordBg" style={{ backgroundImage: `url(${authBGImg})` }}>
       <form className="resetForm" onSubmit={handlePassword}>
       <h1 className="auth-heading">Change Password</h1>
    <div className="inputs">
       <div className="currPassword">
        <label className="password-label">Current Password</label>
      <input type="password"  value={currentPassword} 
        onChange={(e) => setCurrentPassword(e.target.value)}/></div>

        <div className="newPassword">
          <label className="password-label">New Password</label>
        <input type="password"  value={newPassword} 
      onChange={(e) => setNewPassword(e.target.value)}/></div>

        <div className="confPassword">
          <label className="password-label">Confirm Password</label>
              <input type="password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} /></div></div>

          <div className="actionbtn">
      <button className="clear" onClick={() => navigate("/dashboard")}>Cancel</button>
      <button className='passwordbtn' type='submit'>Update Password</button>
      </div>
     </form>
            {message && (
        <div className={`message ${message.type}`}>
          <span>{message.text}</span>
          <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
      )}
    </div>
  )
}

export default Changepassword
