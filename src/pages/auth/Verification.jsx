import React, { useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API from "@/service/axios";
import Toast from "../../components/Toast";
import logoMain from "../../assets/img/titleLogo.png";

const Verification = () => {
  const navigate = useNavigate();
  const { verifyAccount } = useAuth();
 
  const [resendTimer, setresendTimer] = useState(26);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState(null);
  const [resendDisable, setResendDisable] = useState(false);
  const inputs = useRef([]);

  const handleChange = (el, idx) => {
    if (!/^\d?$/.test(el.value)) return;
    const newOtp = [...otp];
    newOtp[idx] = el.value;
    setOtp(newOtp);
    if (el.value && idx < 5) inputs.current[idx + 1].focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[idx]) newOtp[idx] = "";
      else if (idx > 0) inputs.current[idx - 1].focus();
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;
    const newOtp = pasteData.split("");
    setOtp(newOtp);
    inputs.current[newOtp.length - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const otpString = otp.join("");
    const email = localStorage.getItem("pendingEmail");

    if (!email) return setMessage({ type: "error", text: "Session expired. Please sign up again." });
    if (otpString.length !== 6) return setMessage({ type: "warning", text: "Enter 6-digit code!" });

    try {
      const res = await verifyAccount({ email, otp: otpString });
      if (res?.token) localStorage.setItem("login_token", res.token);

      localStorage.removeItem("pendingEmail");

      if (!res?.hasPin) navigate("/pin/create");
      else navigate("/pin/verify");
    } catch (error) {
      setMessage({ type: "error", text: error?.message || "Something went wrong. Try again!" });
    }
  };

  const handleResend = async () => {
    if (resendDisable) return;
    setResendDisable(true);
    setresendTimer(26);

    const email = localStorage.getItem("pendingEmail");
    if (!email) return setMessage({ type: "error", text: "Session expired. Please sign up again." });

    try {
      await API.post("/auth/resend-otp", { email });
      setMessage({ type: "success", text: "OTP resent successfully!" });
      setOtp(new Array(6).fill(""));
      inputs.current[0]?.focus();

      const interval = setInterval(() => {
        setresendTimer(prev => {
           if(prev <= 1) {
          clearInterval(interval);
          setResendDisable(false);
          return 0;
           }
           return prev - 1;
        });
      }, 1000);
    setMessage({ type: "success", text: "Email verified!" });
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || "Something went wrong!" });
      setresendTimer(fasle);
    } finally {
      setTimeout(() => setResendDisable(false), 3000);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo"><img src={logoMain} alt="logo" /></div>
        <form onSubmit={handleSubmit} className="verifyCard">
          <h1 className="auth-heading">Verify Your Email</h1>
          <p>We’ve sent a 6-digit code to</p>
          <p className="pendingEmail">{localStorage.getItem("pendingEmail")}</p>

          <div className="otpBox">
            {otp.map((v, i) => (
              <input
                key={i} maxLength={1} ref={(el) => (inputs.current[i] = el)}
                value={v} onChange={(e) => handleChange(e.target, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste} className="otp"
              />
            ))}
          </div>

          <button type="submit" className="primary-btn" disabled={otp.join("").length !== 6}>Verify</button>
          <div className="lastText">
            <p className="text">Resend OTP in 26 seconds</p>
            <span onClick={() => { localStorage.removeItem("pendingEmail"); navigate("/register")}}>Back to Sign Up</span>
          </div>
        </form>
      </div> 

      <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
    </div>
  );
};

export default Verification;