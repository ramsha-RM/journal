import React, {useState } from 'react'
import API from './api'
import '../CSS/signup.css'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import loginImg from '../assets/add-user.png'

  const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setemailError] = useState('');
  const [passwordError, setpasswordError] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setemailError('');
    setpasswordError('');
    setMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if(!email){
      setemailError("Please enter your email!");
      isValid = false;
    }else if(!emailRegex.test(email)){
      setemailError("Please enter a valid email!");
      isValid = false;
    }
    if(!password || password.length < 6){
    setpasswordError("Password must be atleast 6 characters!");
    isValid = false;
    }
if(!isValid) return;


    try{
      const res = await API.post('auth/login',{
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

setMessage({type: "success", text: "Login successful!"});
setTimeout(() => {
  navigate('/Createpin');
}, 3000);
    }catch(error){
if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        setMessage({type:"warning", text:"Invalid input data!"});
      } else if (status === 401) {
        setMessage({type:"error",  text:"Invalid email or password!"});
      }else if(status === 404){
      setMessage({type:"info", text:"User not found"})
    }else if(status === 500){
      setMessage({type:"error", text:"Server error. Try again Later."}) 
    }
    } else if(error.request){
       setMessage({type:"error", text:"Network error. Check your internet connection!"})
    }else {
      setMessage({type:"error",  text:"Unexpected error"});
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
        <img src={loginImg} alt="logo" className='signupicon' />
        <p className='textline'>Log in to continue your daily notes.</p>

        <div className='emailBox'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className='emailInput'
            autoComplete='off'
          />
          {emailError && <small className='small'>{emailError}</small>}
        </div>

        <div className='passwordBox'>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className='passwordInput'
            autoComplete='new-password'
          />
          {passwordError && <small className='small'>{passwordError}</small>}
        </div>

        <button type='submit' className='signupbtn'>Login</button>

        <span className="forgetPassword" onClick={() => navigate("../password/forgot-password")}>
          Forgot password?</span>

        <p className="bottomtext">
          Don't have an account! <span onClick={() => navigate('/signup')}>Signup</span>
        </p>
      </form>

      {message && (
        <div className='errBox'>
          <span>{message.text}</span>
          <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
      )}
    </div>
  );

};

export default Login;

