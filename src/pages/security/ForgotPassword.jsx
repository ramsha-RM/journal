import React, { useState } from 'react';
import API from '@/service/axios';
import { useNavigate } from 'react-router-dom';
import "../../style/authstyle/resetPassword.css"
import Toast from '../../components/Toast'
// import authBGImg from '../../assets/img/Ractangle.png'

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
           await API.post("/auth/forgot-password", {  email });
            setMessage({type:"success",  text:"OTP sent to your email. Please check inbox."})
            setTimeout(() => {
            navigate("/password/reset", { state: { email } });
          }, 1500);
        } catch (error) {
            setMessage({type:"error", text: error.response?.data?.message || "Email not found"});
        }
    };
  return (
    <div className="auth-wrapper">
         <form onSubmit={handleForgot} className='modal-content resetForm'>
       <h2 className='auth-heading'>Forgot Password</h2>
       <p className='textline'>Enter your email to reset your password.</p>
  
      <div className="input-group">
       <label className="password-label">Email</label>
       <input type="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="action-row">
      <button type="submit" className='passwordbtn'>Send Link</button>
     </div>
     <p className="btext">Check your inbox after submitting!</p>
    </form>
<Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
    </div>
  )
}

export default Forgotpassword
