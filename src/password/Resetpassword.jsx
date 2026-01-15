import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../pages/api'
import "../CSS/resetpassword.css"
import journalImg from '../assets/journal.png'
import { useSearchParams } from 'react-router-dom'

const Resetpassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams;
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if(!password || password.length < 6) {
      setMessage({type:"error", text:"Password must be atleast 6 characters!"})
      return;
    }
    if(password !== confirmPassword){
      setMessage ({type:"error", text:"Password do not matched!"});
      return;
    }
    try{
      await API.post("auth/reset-password", {
        token,
        newPassword: password,
      })
      setMessage({type:"success", text:"Password reset successful! Login..."});
      setTimeout(() => navigate("/login"),
       3000);
    }catch(error){
      setMessage({type:"error", text:"Reset failed. Try again later!"})
    }
  };
  return (
    <div>
           <div className='mainHeading'>
              <img src={journalImg} alt="journal" className='journal' />
              <h2 className='htext'>DailyNotes</h2>
            </div>
          
          <form onSubmit={handleSubmit} className="resetForm"></form>
            <div className="container">
              <h2>Reset your password</h2>
              <form className="resetForm" onSubmit={handleSubmit}>
                <input type="password" placeholder='New password' value={password} 
                onChange={(e) => setPassword(e.target.value)} />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className='passwordbtn' type='submit'>Reset Password</button>
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
