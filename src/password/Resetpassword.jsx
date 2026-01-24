import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../pages/axios';
import "../CSS/resetPassword.css"
import journalImg from '../assets/journal.png'
import { useSearchParams } from 'react-router-dom'

const Resetpassword = () => {
  const {state} = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
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
    <div>
           <div className='mainHeading'>
            <img src={journalImg} alt="journal" className='journal' />
            <h2 className='htext'>DailyNotes</h2>
            </div>
        <div className="container">
          <h2>Reset your password</h2>
          <form className="resetForm" onSubmit={handleSubmit}>
              <p className='textline'>Enter your password for change your password.</p>
        <input type="text" placeholder="Enter OTP from email"
        value={otp} onChange={(e) => setOtp(e.target.value)} />
        <input type="password" placeholder='New password' value={newPassword} 
      onChange={(e) => setNewPassword(e.target.value)} />
       <button  className='passwordbtn'  type="submit">Reset Password</button>

      <p className="bottomtext">Choose a strong password!</p>
      </form>        
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}
              <button type='button' className="closeBtn" onClick={() => setMessage(null)}>❌</button>
            </div>
            }
    </div>
  );
}

export default Resetpassword
