import React, { useRef, useState } from 'react';
import PinImg from '../assets/pin.png';
import { useNavigate } from 'react-router-dom';
import journalImg from '../assets/journal.png';
import '../CSS/verification.css';
import API from './axios';

const Createpin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3) pinRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newPin = [...pin];
      if (pin[index] === "" && index > 0) {
        newPin[index - 1] = "";
        setPin(newPin);
        pinRefs.current[index - 1].focus();
      } else {
        newPin[index] = "";
        setPin(newPin);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasteData) return;
    const newPin = pasteData.split("");
    setPin(newPin);
    pinRefs.current[newPin.length - 1]?.focus();
  };

  const handleCreatepin = async (e) => {
    e.preventDefault();
    const pinStr = pin.join("");
    if (pinStr.length !== 4) {
      setMessage({ type: "error", text: "PIN must be 4 digits!" });
      return;
    }
    setMessage(null);
    setLoading(true);
    try {
      const hasPinRefs = await API.get('/pin/has-pin');
      if (hasPinRefs.data.hasPin) {
        navigate("/pin/verify");
        return;
      }
      const res = await API.post("/pin/create", { pin: pinStr });
      if(res.data.hasPin){
        navigate("/pin/verify");
        return;
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setMessage({ type: "error", text: "Login token expired. Please login again!" });
          localStorage.removeItem(import.meta.env.VITE_LOGIN_TOKEN_KEY);
          navigate("/login");
        } else if(status === 409) {
          setMessage({ type: "warning", text: "PIN already exists" });
        } else if (status === 400) {
          setMessage({ type: "info", text: "Invalid format" });
        } else if (status === 500) {
          setMessage({ type: "error", text: "Server error" });
        } else {
          setMessage({ type: "error", text: "Network issue. Please try later!" });
        }
      }
    } finally {
      setLoading(false);
    }
  };
const handleReset = () => {
  setPin(new Array(4).fill(""));
  setMessage(null);
  pinRefs.current[0]?.focus();
}

  return (
    <div>
      <div className='mainHeading'>
        <img src={journalImg} alt="journal" className='journal' />
        <h2 className='htext'>DailyNotes</h2>
      </div>

      <form onSubmit={handleCreatepin} className='verifyCard'>
        <img src={PinImg} alt="logo" className='pinicon' />
        <p className='text'>Create PIN</p>
        <div className="pinBox">
          {pin.map((v, i) => (
            <input
              key={i}
              ref={(el) => (pinRefs.current[i] = el)}
              type='text'
              value={v}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="pin"
            />
          ))}
        </div>

        <button type='submit' className="verify" disabled={loading}>{loading ? "Creating PIN..." : "Create PIN"}</button>
         <p className="bottomtext">
          Re-enter PIN! <span onClick={handleReset}>Reset</span>
        </p>
      </form>

      {message && (
        <div className={`errBox ${message.type}`}>
          <span>{message.text}</span>
          <button className="closeBtn" onClick={() => setMessage(null)}>❌</button>
        </div>
      )}
    </div>
  );
};

export default Createpin;
