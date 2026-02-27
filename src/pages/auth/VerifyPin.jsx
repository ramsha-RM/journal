import React, {useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import logoImg from '../../assets/img/titleLogo.png'
import '../../style/authstyle/auth.css'
import '../../style/authstyle/verification.css';
import Toast from '../../components/Toast'
import API from '@/service/axios'

const Verifypin = () => {
  const navigate = useNavigate();
  const { verifyPin, hasPin } = useAuth();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
 
  const handleKeyDown = (e, index) => {
    if(e.key === "Backspace") {
    e.preventDefault();

    const newPin = [...pin];
    if(pin[index] === "" && index > 0){
      newPin[index - 1] = "";
    setPin(newPin);
    inputs.current[index-1].focus();
    }else{
      newPin[index] = "";
      setPin(newPin);
    }
  }
}

const handlePaste = (e) => {
  e.preventDefault();

  const pasteData = e.clipboardData
  .getData("text").replace(/\D/g,"").slice(0, 4);
  if(!pasteData) 
    return;
  const newPin = pasteData.split("");
  setPin(newPin);
  inputs.current[newPin.length - 1]?.focus();
};

  const handleChange = (value, index) => {
    if(!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if(value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);

  const pinStr = pin.join("");
if(pinStr.length !== 4){
  setMessage({type:'error', text:'Please enter your 4-digit pin!'});
  return;
}
setLoading(true);
try {
 await verifyPin({ pin: pinStr });
  localStorage.setItem("pin_verified", "true");
  // const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || 'login_token';
  // const storedLoginToken = localStorage.getItem(LOGIN_KEY);
  // const res = await verifyPin ({ pin: pinStr })
  // const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token';
  // const loginToken = res.data.token || res.data.loginToken;
  // const accessToken = res.data.accessToken;
  // if (!loginToken && !accessToken) {
  //   setMessage({ type: 'error', text: 'Token missing from response' });
  //   return;
  // }
  // if (loginToken) localStorage.setItem(LOGIN_KEY, loginToken);
  // if (accessToken) {
  //   localStorage.setItem(ACCESS_KEY, accessToken);
  //   localStorage.setItem('pin_verified', 'true');
  // }

  navigate('/dashboard');

} catch (error) {
if(error.response){
  const status = error.response?.status;
if(status === 404){
    setMessage({type:'error', text:'Please first create a PIN'});
  }else if(status === 403){
    setMessage({type:'error', text:'Wrong PIN'});
  }else if(status === 500){
    setMessage({type:'error', text:'Server error'});
  }else{
    setMessage({type:'error', text:'Network issue. Please try later!'})
  }
  }
 }finally{
   setLoading(false);
 }
}
  return (
     <div className="auth-wrapper">
        <div className="auth-card">

    <div className="logo">
   <img  src={logoImg} alt="logo" />
    </div>
        <form onSubmit={handleSubmit} className='verifyCard'>
    
             <h2 className="auth-heading">Confirm your PIN</h2>
        <p className="textline">Please confirm your PIN</p>
            
        <div className="pinBox">
          {pin.map((v, i) => (
            <input key={i} value={v}
            type='text'
            inputMode="numeric"
            pattern='\d*'
            autoComplete="one-time-code"
            ref={(el) => (inputs.current[i] = el)}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className="pin" />
          ))}
        </div>
            
        <button disabled={pin.join("").length !== 4 || loading} type='submit' className="primary-btn">{loading ? "Verifying..." : "Continue"}</button>
        <p className="verifyText">Back to
        <span onClick={() => navigate("/pin/create")} >changes PIN</span> </p>
        </form>
</div>
      <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />           
         </div>
  )
}

export default Verifypin
