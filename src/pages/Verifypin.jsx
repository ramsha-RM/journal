import React from 'react'
import PinImg from '../assets/pin.png'
import Verification from './verification'
import API from './api'

const Verifypin = () => {
  return (
    <div>
       <div className='mainHeading'>
        <img src={journalImg} alt="journal" className='journal' />
        <h2 className='htext'>DailyNotes</h2>
        </div>
            
        <form onSubmit={handleSubmit} className='verifyCard'>
        <img src={PinImg} alt="logo" className='pinicon' />
        <p className='text'>Enter pin.</p>
            
        <p className="destext">Welcome back! Enter your pinto continue.</p>
            
        <div className="otpBox">
        <input type="tel" 
        maxlength={1} placeholder="" 
        className="otp" autoComplete="one-time-code" />
        <input type="tel" 
        maxlength={1} placeholder="" 
        className="otp" />
        <input type="tel" 
         maxlength={1} placeholder="" 
        className="otp" />
        <input type="tel" 
         maxlength={1} placeholder="" 
        className="otp" />
        </div>
            
        <button type='submit' className="verify">Continue</button>
        <p className="lastText">Forgot your PIN?
        <span>Reset</span> </p>
        {message && (
        <div className='errBox'>
        <span>{message.text}</span>
        <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
        )
            }           
            </form>
    </div>
  )
}

export default Verifypin
