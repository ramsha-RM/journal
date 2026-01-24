import React, { useState } from 'react';
import API from '../pages/axios';
import { useNavigate } from 'react-router-dom';
import "../CSS/resetPassword.css"
import journalImg from '../assets/journal.png'

const Forgotpassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleForgot = async (e) => {
     e.preventDefault()
      setMessage(null);

          if (!email) {
      setMessage({ type: "error", text: "Please enter your email!" });
      return;
    }
        try {
           const res = await API.post("/auth/forgot-password", {  email });
            setMessage({type:"success",  text:"OTP sent to your email. Please check inbox."})
            setTimeout(() => {
            navigate("/password/reset", { state: { email } });
          }, 1500);
        } catch (error) {
            setMessage({type:"error", text: error.response?.data?.message || "Email not found"});
        }
    };
  return (
    <div>
      <div className='mainHeading'>
        <img src={journalImg} alt="journal" className='journal' />
        <h2 className='htext'>DailyNotes</h2>
      </div>
        <form onSubmit={handleForgot} className='resetForm'>

           <p className='textline'>Enter your email for Set your password.</p>
        <input type="email" placeholder='Enter your email'  value={email} 
      onChange={(e) => setEmail(e.target.value)}/>

      <button type="submit" className='passwordbtn'>Send your link</button>
      <p className="bottomtext">Check your inbox after submitting!</p>
</form>
{message && (
  <div className={`errBox ${message.type}`}>
    <span>{message.text}</span>
    <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
  </div>
)}
    </div>
  )
}

export default Forgotpassword
