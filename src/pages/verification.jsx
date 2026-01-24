import React, {useRef, useState } from 'react'
import API from './axios'
import '../CSS/verification.css'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import VerifiedImg from '../assets/verified.png'

const Verification = () => {
const navigate = useNavigate(); 
const [otp, setOtp] = useState(new Array(6).fill(""));
const [message, setMessage] = useState(null);
const [resendDisable, setResendDisable] = useState(false);
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
    if(e.key === "Backspace") {
    e.preventDefault();

    const newOtp = [...otp];
   newOtp[index] = "";
    setOtp(newOtp);
    }
  };

const handlePaste = (e) => {
  e.preventDefault();

  const pasteData = e.clipboardData
  .getData("text").replace(/\D/g,"").slice(0, 6);
  if(!pasteData) 
    return;
  const newOtp = pasteData.split("");
  setOtp(newOtp);
  inputs.current[newOtp.length - 1]?.focus();
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
}, 2000);

    }catch(error){
setMessage({type: "error", text: error.response?.status === 400 ? "Invalid or expired OTP!" 
: "Something went wrong. Try again!"})
}
};
const handleReset = async () => {
  if(resendDisable) return;
  setResendDisable(true)
const email = localStorage.getItem('pendingEmail');
if(!email){
  setMessage({type:'error', text:'Session expired. Please sign up again.'})
  return;
}
try {
  await API.post('/auth/resend-otp', {email})
  setMessage({type:'success', text:'OTP resent successfully!'})
  setOtp(new Array(6).fill(""))
  inputs.current[0]?.focus();
} catch (error) {
  setMessage({type:'error', text:error.response?.data?.message || 'Failed to resend OTP!'})
  }
  setTimeout(() =>
    setResendDisable(false), 3000);
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
          onKeyDown={handleKeyDown}
          onPaste={handlePaste} className='otp' />
         ))}
       </div>

  <button type='submit' className="verify" disabled={otp.join("").length !== 6}>Verify</button>
      <p className="lastText"> Didn’t receive the code?
              <span onClick={handleReset} 
          style={{cursor: resendDisable ? 'not-allowed' : 'pointer',  opacity: resendDisable ? 0.6 : 1}}>Resend</span> </p>
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
