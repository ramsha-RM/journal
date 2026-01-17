import React, { useRef, useState } from 'react'
import PinImg from '../assets/pin.png'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import '../CSS/verification.css'
import API from './api'

const Createpin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [confirmPin, setConfirmPin] = useState(new Array(4).fill(""));
  const [message, setMessage] = useState(null);
  const pinRefs = useRef([]);
  const confirmRefs = useRef([]);
  
const handleChange = (value, index, type) =>{
if(!/^\d$/.test(value)) 
  return;

const target = type === "pin" ? [...pin] : [...confirmPin];
target[index] = value;
type === "pin" ? setPin(target) : setConfirmPin(target);
if(value && index < 3){
  (type === "pin" ? pinRefs : confirmRefs).current[index + 1].focus();
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);

 const pinStr = pin.join("");
 const confirmStr = confirmPin.join("");

if(pinStr.length !== 4 || confirmStr.length !== 4){
  setMessage({type:'error', text:'Please create a 4-digit pin!'});
  return;
}
if(pinStr !== confirmStr){
  setMessage({type:"error", text:"PINs do not match"})
  return;
}
try {
  const res = await API.post('/pin/create',{  pin: pinStr })
  setMessage({type:'success', text:'PIN created!'})
  setTimeout(() => {
    navigate("/pin/verify")
  // window.location.href = './Verifypin'
}, 1500);
} catch (error) {
if(error.response){
  const status = error.response.status;
  if(status === 409){
    setMessage({type:'warning', text:'PIN already exists'});
  }else if(status === 400){
    setMessage({type:'info', text:'Invalid format'});
  }
  else if(status === 401){
    setMessage({type:'error', text:'Login token expired. Please login again!'});
  }else if(status === 500){
    setMessage({type:'error', text:'Server error'});
  }else{
    setMessage({type:'error', text:'Network issue. Please try later!'})
  }
  }
 }
}

  return (
    <div>
      <div className='mainHeading'>
        <img src={journalImg} alt="journal" className='journal' />
        <h2 className='htext'>DailyNotes</h2>
        </div>
      
        <form onSubmit={handleSubmit} className='verifyCard'>
        <img src={PinImg} alt="logo" className='pinicon' />
        <p className='text'>Create pin.</p>
      
        <p className="destext">Enter your 4-digit PIN to 
        securely access your dashboard.</p>
      
        <div className="pinBox">
           {pin.map((v, i) => (
            <input key={i} ref={(el) => (pinRefs.current[i] = el)}
            value={v}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i, "pin")}
            className="otp" />
           ))}
         </div>
         <p className="confirmPin">Confirm PIN</p>
         <div className="otpBox">
          {confirmPin.map((v, i) => (
              <input key={i} 
              ref={(el) => (confirmRefs.current[i] = el)}
              value={v} maxLength={1} 
              onChange={(e) => handleChange(e.target.value, i, "confirm")}
             className="otp" />
          ))}
         </div>
      
     <button type='submit' className="verify">Continue</button>
        <p className="lastText">Forgot your PIN?
        <span onClick={() => navigate('/resetpin')}>Reset</span> </p>
            </form>
  {message && (
  <div className={`errBox ${message.type}`}>
    <span>{message.text}</span>
    <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
  </div>
        )
      }           
  
    </div>
 )
}

export default Createpin
