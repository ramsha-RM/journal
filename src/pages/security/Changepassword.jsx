import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '@/service/axios';
import "../../style/authstyle/resetPassword.css" 
// import authBGImg from '../../assets/img/Ractangle.png'
import ShowHidePass from '../../components/ShowHidePass';

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
         });
            setMessage({type: "success", text: "Password changed successfully!" })
           setTimeout(() => {
             navigate("/dashboard");
           }, 2000);
        } catch (error) {
           if (error.response) {
        if (error.response.status === 401) {
          setMessage({ type: "error", text: "Unauthorized. Please login again." });
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 403) {
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
    <div className="modal-overlay">
      <form className="modal-content resetForm" onSubmit={handlePassword}>
        <h2 className="pass-heading">Change Password</h2>
        <p className='btext'>Update your password below.</p>

      <div className="input-container" style={{
        display: "flex", flexDirection: "column",  gap: "12px"
      }}>
        <ShowHidePass 
          label="Current Password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
        />
        <ShowHidePass 
          label="New Password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <ShowHidePass 
          label="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
      </div>

        <div className="actionbtn">
          <button type="button" className="clear" onClick={() => navigate("/dashboard")}>Cancel</button>
          <button className='passwordbtn' type='submit'>Update</button>
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

export default Changepassword
