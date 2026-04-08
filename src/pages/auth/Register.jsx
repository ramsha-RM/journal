import React, {useState } from 'react'
import useAuth from '@/hooks/useAuth'
import {useNavigate} from 'react-router-dom'
import '../../style/authstyle/auth.css'
import Toast from '../../components/Toast'
import logoMain from '../../assets/img/titleLogo.png'
import ShowHidePass from '../../components/ShowHidePass'

  const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

const validate = () => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if(!userName || userName.length < 3){
    newErrors.name = "Name must be atleast 3 characters!";
  }
  if(!email){
    newErrors.email = "Please enter your email!";
  }else if(!emailRegex.test(email)){
    newErrors.email = "Please enter a valid email!";
  }
  if(!password || password.length < 6){
    newErrors.password = "Password must be atleast 6 characters!";
  }
//   if(password !== confirmPassword){
//     newErrors.confirmPassword = "Passwords do not match!";
// }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if(!validate()) return;

    try{
      setLoading(true);
      localStorage.clear();
      
        await register({
        name: userName?.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: password.trim(),
      });

localStorage.setItem('pendingEmail', email.trim().toLowerCase());
localStorage.setItem('username', userName.trim());
  
setMessage({type: "success", text: "Registration successful. Please check your email to verify your account."});
setTimeout(() => {
  navigate('/verification');
}, 1500);
    }catch (error) {

  if (error.response) {
    const status = error.response.status;
    const backendMessage = error.response.data?.message;

    if (status === 409) {
      setMessage({
        type: "warning",
        text: "Email already exists!"
      });

    } else if (status === 400) {
      setMessage({ type: "info", text: backendMessage || "Invalid input. Please check your data!"});
    } else if (status === 500) {
      setMessage({ type: "error", text: backendMessage || "Server error. Please try again later!" });
    } else {
      setMessage({ type: "error", text: backendMessage || "Something went wrong!"});
    }
  } else if (error.request) {
    setMessage({type: "error", text: "Server not reachable. Please try later!"});
  } else {
    setMessage({ type: "error", text: error.message || "Unexpected error occurred!" });
  }
} finally {
  setLoading(false);
}
  };
  return (
    <div className="auth-wrapper">
     <div className="auth-card">

      <div className="logo">
       <img src={logoMain} alt="logo" />
    </div>

      <form onSubmit={handleSubmit} className='signupBox' id='form'>
        <h2 className="auth-heading">Create Account</h2>
        <p className='textline'>Start your journaling journey</p>

     <div className="inputArea">
      <div className="nameBox">
        <label htmlFor="name" className='nameLabel'>Full Name</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} 
          className='nameInput' autoComplete='off' />
        {errors.name && <small className='small'>{errors.name}</small>}
      </div>

        <div className='emailBox'>
          <label htmlFor="Email" className="emailLabel">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
          className='emailInput' autoComplete='email' />
          {errors.email && <small className='small'>{errors.email}</small>}
        </div>

        <ShowHidePass 
        label="Password"  name="password"
        value={password} onChange={(e) => setPassword(e.target.value)}/>
          {errors.password && <small className='small'>{errors.password}</small>}
        </div>
        <button type='submit' className='primary-btn' disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>

        <p className="bottomtext">
          Already have an account! <span onClick={() => navigate('/')}>Login</span>
        </p>
     </form>
      </div>
 
  <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
      </div>

  );
};

export default Register
