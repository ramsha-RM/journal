import React, {useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import PinImg from '../assets/pin.png'
import journalImg from '../assets/journal.png'
import '../CSS/verification.css'
import API from './api'

const Verifypin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [message, setMessage] = useState(null);
  const inputs = useRef([]);


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
try {
  const res = await API.post('pin/verify',{ pin: pinStr })
  localStorage.setItem("verifyPin_token", res.data.token)

  setMessage({type:'success', text:'PIN verified!'})
  setTimeout(() => {
  navigate("/dashboard") 
}, 3000);
} catch (error) {
if(error.response){
  const status = error.response?.status;
 if(status === 401){
    setMessage({type:'error', text:'Login token expired. Please login again!'});
  }else if(status === 404){
    setMessage({type:'error', text:'Please first create a PIN'});
  }else if(status === 403){
    setMessage({type:'error', text:'Wrong PIN'});
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
        <p className='text'>Enter your 4-digit pin to continue.</p>
            
        <p className="destext"></p>
            
        <div className="pinBox">
          {pin.map((v, i) => (
            <input key={i} value={v}
            ref={(el) => (inputs.current[i] = el)}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i)}
            className="pin" />
          ))}
        </div>
            
        <button disabled={pin.join("").length !== 4} type='submit' className="verify">Continue</button>
        <p className="lastText">Forgot your PIN?
        <span>Reset</span> </p>
        </form>

        {message && (
        <div className='errBox'>
        <span>{message.text}</span>
        <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
        )
            }           
         
    </div>
  )
}

export default Verifypin
