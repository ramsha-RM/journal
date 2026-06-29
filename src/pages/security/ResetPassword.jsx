import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../../service/api.interceptor';

import "../../style/AuthStyle/resetPassword.css"
import { useSearchParams } from 'react-router-dom'

import Toast from '../../components/Toast'
import ShowHidePass from '../../components/ShowHidePass';

const ResetPassword = () => {
  const {state} = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const email = state?.email;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if(!email || !newPassword || !otp) {
      setMessage({type:"error", text:"All fields required!"})
      return;
    }
    try{
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      })
      setMessage({type:"success", text:"Password reset successful! Login..."});
      setTimeout(() => navigate("/login"),
       1500);
    }catch(error){
          setMessage({ type: "error", text: error.response?.data?.message || "Invalid OTP"});
    }
  };
  return (
    <div className="auth-wrapper">
          <form className="modal-content resetForm" onSubmit={handleSubmit}>
      <h2 className='auth-heading'>Reset Password</h2>
      <p className='textline'>Enter the OTP and your new password.</p>
  
      <div className="input-group">
        <label className="password-label">Email</label>
        <input type="email" className="email" value={email} readOnly />
      </div>
      <div className="input-group">
        <label className="password-label">OTP</label>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
      </div>
       <div className="input-container" style={{
        display: "flex", flexDirection: "column",  gap: "12px"
      }}>
        <ShowHidePass 
          label="New Password" 
          value={newPassword} 
         onChange={(e) => setNewPassword(e.target.value)} 
        /></div>

      <div className="action-row">
        <button className='passwordbtn' type="submit">Reset Password</button>
      </div>

    </form>

   
        <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
    </div>
  );
}

export default ResetPassword
