import React, { useState } from 'react';
import API from "../pages/api";
import { useNavigate } from 'react-router-dom';
import "../CSS/resetpassword.css"
import journalImg from '../assets/journal.png'

const Forgotpassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleForgot = async () => {
      setMessage(null);

          if (!email) {
      setMessage({ type: "error", text: "Please enter your email!" });
      return;
    }
        try {
            await API.post("auth/forgot-password", {  email });
            setMessage({type:"success",  text:"Check your email for reset password."})
            navigate("/reset-password");
        } catch (error) {
            setMessage({type:"error", text:"Email not found"});
        }
    };
  return (
    <div>
      <div className='mainHeading'>
        <img src={journalImg} alt="journal" className='journal' />
        <h2 className='htext'>DailyNotes</h2>
      </div>
        <form onSubmit={handleForgot} className='resetForm'>
        <input type="email" placeholder='Enter your email'  value={email} 
      onChange={(e) => setEmail(e.target.value)}/>

      <button className='passwordbtn' onClick={handlePassword}>Send your link</button>
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

export default Forgotpassword
