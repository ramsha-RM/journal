import React, {useRef, useState } from 'react'
import API from '@/service/axios'
import useAuth from '@/hooks/useAuth'
import '../../style/authstyle/auth.css'
import '../../style/authstyle/verification.css';
import Toast from '../../components/Toast'
import {useNavigate} from 'react-router-dom'
import logoMain from '../../assets/img/titleLogo.png'

const Verification = () => {
const navigate = useNavigate(); 
const { verifyAccount, hasPin } = useAuth();
const [otp, setOtp] = useState(new Array(6).fill(""));
const [message, setMessage] = useState(null);
const [resendDisable, setResendDisable] = useState(false);
const inputs = useRef([]);

const handleChange = (element, index) => {
  if(!/^\d?$/.test(element.value)) return;

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
    if(otp[index]){
    newOtp[index] = "";
    setOtp(newOtp);
    }else if(index > 0){
   inputs.current[index - 1].focus();
    }
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
if (!email) {
  setMessage({ type: "error", text: "Session expired. Please sign up again." });
  return;
}

  if (otpString.length !== 6) {
    setMessage({ type: "warning", text: "Please enter the 6-digit code!" });
    return;
  }

try {
  const payload = {
    email: String(email).trim(),
    otp: String(otpString).trim()
  }
  if(!payload.email || payload.otp.length !== 6){
  setMessage({ type: "error", text: "Please enter a valid 6-digit OTP and email!" });
  return;
  }
   console.log("VERIFY ACCOUNT PAYLOAD:", payload);
  const res = await verifyAccount(payload); 

 

 if (res?.token) {
  localStorage.setItem("access_token", res.token);
}

  localStorage.removeItem("pendingEmail");

  if (res?.hasPin === false) navigate("/pin/create");
  else navigate("/pin/verify");

} catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    const backendMessage = error.response?.data?.message;

    if (error.response?.status === 400) {
      setMessage({ type: "error", text: "Invalid or expired OTP!" });
    } else if (backendMessage) {
      setMessage({ type: "error", text: backendMessage });
    } else {
      setMessage({ type: "error", text: "Something went wrong. Try again!" });
    }
  }
};

const handleReset = async () => {
  if(resendDisable) return;
  setResendDisable(true)

const email = localStorage.getItem("pendingEmail");
if(!email){
  setMessage({type:'error', text:'Session expired. Please sign up again.'})
  return;
}
try {
  await API.post('/auth/resend-otp', {email})
  setMessage({type:'success', text:'OTP resent successfully!'})
  setOtp(new Array(6).fill(""))
  inputs.current[0]?.focus();

} catch(error){
  console.error("VERIFY OTP ERROR:", error);
  const backendMessage = error.response?.data?.message;
  if (error.response?.status === 400) {
    setMessage({ type: "error", text: "Invalid or expired OTP!" });
  } else if (backendMessage) {
    setMessage({ type: "error", text: backendMessage });
  } else {
    setMessage({ type: "error", text: "Something went wrong. Try again!" });
  }
}
  setTimeout(() =>
    setResendDisable(false), 3000);
 };

 
  return (

   <div className="auth-wrapper">
     <div className="auth-card">

   <div className="logo">
   <img src={logoMain} alt="logo" />
    </div>

      <form onSubmit={handleSubmit} className='verifyCard'>
      <h1 className="auth-heading">Verify Your Email</h1>
        <p className='text'>We’ve sent a 6-digit verification code to</p>
        <p className="pendingEmail"> {localStorage.getItem("pendingEmail")}</p>

      <div className="otpBox">
         {otp.map((value, index) => (
          <input type="text" key={index} maxLength={1} ref={(el) => (inputs.current[index] = el)}
          value={value} onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste} className='otp' />
         ))}
       </div>

  <button type='submit' className="primary-btn" disabled={otp.join("").length !== 6}>Verify</button>

      <p className="lastText"> Resend OTP in 26 seconds
              <span onClick={() => navigate('/register')} 
         className={ resendDisable ?  "disabledLink" : ""}>Back to Sign Up</span> </p>
          
      </form>
</div>

    <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
        
     
</div>
  );
};

export default Verification;
