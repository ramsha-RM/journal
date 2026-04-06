import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import logoImg from '../../assets/img/titleLogo.png';
import '../../style/authstyle/auth.css';
import '../../style/authstyle/verification.css';
import Toast from '../../components/Toast';

const VerifyPin = () => {
  const navigate = useNavigate();
  const { verifyPin } = useAuth();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const location = useLocation();
  const isTimeout = location.state?.isTimeout || false;

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (pin[index] === "" && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };


  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasteData) return;

    const pasteArray = pasteData.split("");
    const newPin = [...pin];
    
    pasteArray.forEach((char, i) => {
      if (i < 4) newPin[i] = char;
    });

    setPin(newPin);
    const nextIndex = pasteArray.length < 4 ? pasteArray.length : 3;
    inputs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    if (loading) return;

    setMessage(null);
    const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";
    const pinStr = pin.join('');

    if (pinStr.length !== 4) {
      setMessage({ type: 'error', text: 'Please enter your 4-digit PIN!' });
      return;
    }

    setLoading(true);

    try {
      const res = await verifyPin(pinStr);
      const token = res?.accessToken || res?.token || res?.access_token;
      
      if (token) {
        localStorage.setItem(ACCESS_KEY, token);
      }
      if (res?.userId) {
        localStorage.setItem("userId", res.userId);
      }
      
      localStorage.removeItem("login_token");
      setMessage({ type: "success", text: "PIN confirmed!" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      const serverMsg = error?.message || "Invalid PIN. Please try again.";
      setMessage({ type: 'error', text: serverMsg });
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
        <form onSubmit={handleSubmit} className='verifyCard'>
          <h2 className="auth-heading">{isTimeout ? "Session Locked" : "Confirm your PIN"}</h2>
          <p className="textline">
            {isTimeout ? "We’ve locked your session to keep your data safe. Enter your PIN to continue where you left off."
            : "Please confirm your PIN"}
          </p>

          <div className="pinBox">
            {pin.map((v, i) => (
              <input
                key={i}
                value={v}
                type='text'
                inputMode="numeric"
                autoComplete="one-time-code"
                ref={(el) => (inputs.current[i] = el)}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className={`pin ${v ? 'filled' : ''}`}
              />
            ))}
          </div>

          <button 
            disabled={pin.join("").length !== 4 || loading} 
            type='submit' 
            className="primary-btn"
          >
            {loading ? "Verifying..." : isTimeout ? "Unlock" : "Continue"}
          </button>

          {!isTimeout && (
            <p className="verifyText">
              Need to reset? <span onClick={() => navigate("/pin/create")}>Change PIN</span>
            </p>
          )}
        </form>
      </div>
      <Toast 
        show={!!message} 
        message={message?.text} 
        type={message?.type} 
        onClose={() => setMessage(null)} 
      />
    </div>
  );
};

export default VerifyPin;