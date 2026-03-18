import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Toast from "../../components/Toast";
import logoImg from "../../assets/img/titleLogo.png";
import "../../style/authstyle/auth.css";
import ShowHidePass from "../../components/ShowHidePass";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    const authMsg = localStorage.getItem("AUTH_ERROR_MESSAGE");
    if (authMsg) {
      setMessage({ type: "error", text: authMsg });
      localStorage.removeItem("AUTH_ERROR_MESSAGE");
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Please enter your email!";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email!";

    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    try {
      setLoading(true);
      localStorage.clear();

      const res = await login({ email, password });
      if (!res.isVerified) {
        localStorage.setItem("pendingEmail", email.trim().toLowerCase());
        navigate("/verification");
      } else if (!res.hasPin) {
        navigate("/pin/create");
      } else {
        window.location.href = "/pin/verify";
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const status = error?.response?.status;
      const backendMessage =
        error?.response?.data?.message || error?.message || "Something went wrong!";

      switch (status) {
        case 400:
          setMessage({ type: "warning", text: backendMessage });
          break;
        case 401:
          setMessage({ type: "error", text: backendMessage || "Invalid email or password" });
          break;
        case 403:
          if (backendMessage.toLowerCase().includes("verify")) {
            localStorage.setItem("pendingEmail", email.trim().toLowerCase());
            navigate("/verification");
          } else {
            setMessage({ type: "error", text: backendMessage });
          }
          break;
        case 404:
          setMessage({ type: "info", text: backendMessage });
          break;
        case 500:
        default:
          setMessage({ type: "error", text: backendMessage });
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

        <form onSubmit={handleSubmit} className="signupBox">
          <h2 className="auth-heading">Welcome back</h2>
          <p className="textline">Sign in to your account</p>

          <div className="emailBox">
            <label htmlFor="Email" className="emailLabel">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="emailInput"
              autoComplete="email"
            />
            {errors.email && <small className="small">{errors.email}</small>}
          </div>

           <ShowHidePass 
           label="Password"  name="password"
           value={password} onChange={(e) => setPassword(e.target.value)}/>
            {errors.password && <small className="small">{errors.password}</small>}
        

          <div className="mark-password">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                style={{ width: "13px", height: "13px", borderRadius: "50%" }}
              />
              <span className="checkmark"></span>Remember me
            </label>
            <span
              className="forgetPassword"
              onClick={() => navigate("/password/forgot")}
            >
              Forgot password?
            </span>
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="bottomtext">
            Don't have an account? <span onClick={() => navigate("/register")}>Signup</span>
          </p>
        </form>
      </div>

      <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
    </div>
  );
};

export default Login;