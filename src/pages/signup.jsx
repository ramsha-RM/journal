import React, {useState } from 'react'
import API from './api'
import '../CSS/signup.css'
// import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import loginImg from '../assets/add-user.png'

  const Signup = () => {
  // const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setnameError] = useState('');
  const [emailError, setemailError] = useState('');
  const [passwordError, setpasswordError] = useState('');
  const [message, setMessage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setnameError('');
    setemailError('');
    setpasswordError('');
    setMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    if(!name || name.length < 3){
      setnameError("Name must be atleast 3 characters!");
      isValid = false;
    }
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
      const res = await API.post('auth/register',{
        name: name?.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: password.trim(),
      });
setMessage({type: "success", text: "Account created successfully!"});
setTimeout(() => {
  // navigate('../verification');
  window.location.href = '/verification';
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
        <img src={loginImg} alt="logo" className='signupicon' />
        <p className='textline'>Sign up to save your daily thoughts.</p>

        <div className='userNameBox'>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            className='userNameInput'
            autoComplete='off'
          />
          {nameError && <small className='small'>{nameError}</small>}
        </div>

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
            type="passwordHash"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className='passwordInput'
            autoComplete='new-password'
          />
          {passwordError && <small className='small'>{passwordError}</small>}
        </div>

        <button type='submit' className='signupbtn'>Sign up</button>

        <p className="bottomtext">
          Already have an account! <span>Login</span>
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

export default Signup;
