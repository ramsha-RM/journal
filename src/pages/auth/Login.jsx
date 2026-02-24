import {useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import {useNavigate} from 'react-router-dom'
import '../../style/authstyle/auth.css'
import '../../style/authstyle/auth.css'
import logoImg from '../../assets/img/titleLogo.png'

  const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

    useEffect(() => {

      setEmail('');
      setPassword('');
      const authMsg = localStorage.getItem("AUTH_ERROR_MESSAGE");
      if(authMsg) {
        setMessage({type:'error', text: authMsg});
        localStorage.removeItem("AUTH_ERROR_MESSAGE")
      }
    }, []);
    
    const validate = () => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!email){
      newErrors.email = "Please enter your email!";
      }else if(!emailRegex.test(email)){
      newErrors.email = "Please enter a valid email!";
      }

      if(!password || password.length < 6){
      newErrors.password = "Password must be atleast 6 characters!";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if(!validate()) return;

    try{
      setLoading(true);
      const { hasPin, isVerified } = await login({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if(!isVerified){
        navigate('/verification')
      }else{
    navigate(hasPin ? '/pin/verify' : '/pin/create');
      }
    }catch (error) {
  console.error(error);

  if (error.response) {
    const status = error.response.status;
    const backendMessage = error.response.data?.message;
    if (status === 400) {
      setMessage({type: "warning",text: backendMessage || "Invalid input data!"});
    } else if (status === 401) {
      setMessage({type: "error",text: backendMessage || "Invalid email or password!"});
    } else if (status === 404) {
      setMessage({type: "info", text: backendMessage || "User not found"});
    } else if (status === 500) {
      setMessage({type: "error",text: backendMessage || "Server error. Try again later."});
    } else {
      setMessage({type: "error",text: "Something went wrong."});
}
  } else if (error.request) {
    setMessage({type: "error", text: "Server not reachable. Please try later!" });
  } else {
    setMessage({type: "error",text: "Network error. Check your internet connection!"});
  }
} finally {
  setLoading(false);
}

};
 
  return (
  
    <div className="auth-wrapper">
          <div className="auth-card">
  
      <div className="logo">
     <img src={logoImg} alt="logo" />
      </div>

      <form onSubmit={handleSubmit} className='signupBox'>
        <h2 className="auth-heading">Welcome back</h2>
        <p className='textline'>Sign in to your account</p>

        <div className='emailBox'>
           <label htmlFor="Email" className="emailLabel">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='emailInput'
            autoComplete='one-time-code'
          />
          {errors.email && <small className='small'>{errors.email}</small>}
        </div>

        <div className='passwordBox'>
           <label htmlFor="password" className="passwordLabel">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='passwordInput'
            autoComplete='new-password'
          />
          {errors.password && <small className='small'>{errors.password}</small>}
        </div>
        
        <div className="mark-password">
         <label className="custom-checkbox">
          <input type="checkbox" checked={checked}
        onChange={() => setChecked(!checked)}
          style={{ width: "13px", height: "13px", borderRadius: "50%" }}/>
          <span className="checkmark"></span>Remember me
         </label>
        <span className="forgetPassword" onClick={() => navigate("/password/forgot")}>
          Forgot password?</span>
          </div>
        <button type='submit'  disabled={loading} className='primary-btn'>{loading ? "Logging in..." : "Login"}</button>

        <p className="bottomtext">
          Don't have an account! <span onClick={() => navigate('/register')}>Signup</span>
        </p>
      </form>
</div>
   {message && (
  <div className={`errBox ${message.type}`}>
    <span>{message.text}</span>
    <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
  </div>
      )}
    </div>
  );

};

export default Login;

