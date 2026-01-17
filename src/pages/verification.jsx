import React, {useRef, useState } from 'react'
import API from './api'
import '../CSS/verification.css'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import VerifiedImg from '../assets/verified.png'

const Verification = () => {
const navigate = useNavigate(); 
const [otp, setOtp] = useState(new Array(6).fill(""));
const [message, setMessage] = useState(null);
const inputs = useRef([]);

const handleChange = (element, index) => {
  if(!/^\d?$/.test(element .value)) return;

  const newOtp = [...otp];
  newOtp[index] = element.value;
  setOtp(newOtp);
  if(element.value && index < 5){
    inputs.current[index + 1].focus();
  }
};
const handleKeyDown = (e, index) => {
  if(e.key === "Backspace"){
    if(otp[index]){
      const newOtp = [...otp]
      newOtp[index] = "";
      setOtp(newOtp);
    }else if(index > 0){
      inputs.current[index - 1].focus();
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

const otpString = otp.join("");
const email = localStorage.getItem("pendingEmail");

if(!email){
  setMessage({type:"error", text:"Session expired. Please sign up again."});
   return;
}
if(otpString.length !== 6){
    setMessage({type:"warning", text:"Please enter the 6-digit code!"});
    return;
}
    try{
      const res = await API.post('/auth/verify-account',{
        email: email,
        otp: otpString 
      });
setMessage({type: "success", text: "Account verified successfuly!"});
setTimeout(() => {
  navigate('/login');
  // window.location.href = '/login';
}, 3000);
    }catch(error){
setMessage({type: "error", text: error.response?.status === 400 ? "Invalid or expired OTP!" 
: "Something went wrong. Try again!"})
}
};
 
  return (
    <div>
      <div className='mainHeading'>
      <img src={journalImg} alt="journal" className='journal' />
      <h2 className='htext'>DailyNotes</h2>
      </div>

      <form onSubmit={handleSubmit} className='signupBox'>
      <img src={VerifiedImg} alt="logo" className='verifiedicon' />
      <p className='text'>Verify Account.</p>

      <p className="destext">A 6-digit code has been sent 
      to your email. Enter it below to verify your account</p>

      <div className="otpBox">
         {otp.map((value, index) => (
          <input type="text" key={index} maxLength={1} ref={(el) => (inputs.current[index] = el)}
          value={value} onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)} className='otp' />
         ))}
       </div>

  <button type='submit' className="verify" disabled={otp.join("").length !== 6}>Verify</button>
      <p className="lastText"> Didn’t receive the code?
              <span>Resend</span> </p>
      </form>
    {message && (
  <div className={`errBox ${message.type}`}>
    <span>{message.text}</span>
    <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
  </div>
        )
      }
     
    </div>
  );
};

export default Verification;
