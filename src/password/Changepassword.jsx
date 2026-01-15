import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../pages/api';
import "../CSS/resetpassword.css" 
import journalImg from '../assets/journal.png'

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
            await API.post("auth/change-password", {  
              currentPassword,
              newPassword
         },
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("login_token")}`
          }
         }
        );
            setMessage({type: "success", text: "Password changed successfully!" })
           setTimeout(() => {
             navigate("../dashboard");
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
    <div>
            <div className='mainHeading'>
        <img src={journalImg} alt="journal" className='journal' />
        <h2 className='htext'>DailyNotes</h2>
      </div>
       <form className="resetForm" onSubmit={handlePassword}>
        <input type="password" placeholder='New Password'  value={newPassword} 
      onChange={(e) => setCurrentPassword(e.target.value)}/>

              <input type="password" placeholder='Confirm New Password' value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} />
      <button className='passwordbtn' type='submit'>Change password</button>
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
