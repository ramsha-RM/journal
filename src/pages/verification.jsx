import React, {useState } from 'react'
import API from './api'
import '../CSS/verification.css'
// import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import VerifiedImg from '../assets/verified.png'

  const Verification = () => {
const [otp, setOtp] = useState('');
  const [message, setMessage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtp('');
    setMessage(null);

if(!otp || otp.length < 6){
    setMessage({type:"warning", text:"Please enter the 6-digit code!"});
    return;
}
    try{
      const res = await API.post('users/verify-account',{
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
setMessage({type: "success", text: "Account verified successfuly!"});
setTimeout(() => {
//   navigate('../login');
  window.location.href = '/login';
}, 3000);
    }catch(error){
if (error.response) {
      const status = error.response.status;
      if (status === 409) {
        setMessage({type:"warning", text:"Email already exist!"});
      } else if (status === 404) {
        setMessage({type:"info",  text:"Invalid input. Please check your data!"});
      } else {
        setMessage({type:"error", text:"Something went wrong. Try again later!"});
      }
    } else if(error.request){
       setMessage({type:"error", text:"Server not reachable. Please try later!"})
    }else {
      setMessage({type:"error", text:"Network error. Check your internet connection!"});
    }
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
    <input type="tel" 
      maxlength="{1}" placeholder="" 
      className="otp" autocomplete="one-time-code" />
    <input type="tel" 
      maxlength="{1}" placeholder="" 
      className="otp" />
    <input type="tel" 
      maxlength="{1}" placeholder="" 
      className="otp" />
    <input type="tel" 
      maxlength="{1}" placeholder="" 
      className="otp" />
    <input type="tel" 
      maxlength="{1}" placeholder="" 
      className="otp" />
    <input type="tel" 
      maxlength="{1}" placeholder="" 
      className="otp" />
       </div>

<button type='submit' className="verify">Verify</button>
        <p className="lastText"> Didn’t receive the code?
              <span>Resend</span> </p>

        {message && (
          <div className='errBox'>
            <span>{message.text}</span>
       <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
          </div>
        )
}
      </form>
    </div>
  );
};

export default Verification;
