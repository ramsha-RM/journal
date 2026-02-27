import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth'
import '../../style/authstyle/auth.css'
import '../../style/authstyle/verification.css';
import Toast from '../../components/Toast'
import logoMain from '../../assets/img/titleLogo.png';

const CreatePin = () => {
  const navigate = useNavigate();
  const { createPin, hasPin } = useAuth(); 

  const [pin, setPin] = useState(new Array(4).fill(''));
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (index < 3) pinRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newPin = [...pin];
      if (pin[index] === '' && index > 0) {
        newPin[index - 1] = '';
        setPin(newPin);
        pinRefs.current[index - 1]?.focus();
      } else {
        newPin[index] = '';
        setPin(newPin);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;
    const newPin = pasteData.split('');
    setPin(newPin);
    pinRefs.current[newPin.length - 1]?.focus();
  };

  const handleCreatePin = async (e) => {
    e.preventDefault();
    const pinStr = pin.join('');
    if (pinStr.length !== 4) {
      setMessage({ type: 'error', text: 'PIN must be 4 digits!' });
      return;
    }

    setMessage(null);
    setLoading(true);
    try {
      const pinCheck = await hasPin();
      if (pinCheck.hasPin) {    
        setMessage({ type: 'warning', text: 'PIN already exists. Please verify!' });
        navigate('/pin/verify');
        return;
      }

      await createPin({ pin: pinStr });
      navigate('/pin/verify');
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        setMessage({ type: 'error', text: 'Login expired. Please login again!' });
        localStorage.removeItem(import.meta.env.VITE_LOGIN_TOKEN_KEY);
        navigate('/');
      } else if (status === 409) {
        setMessage({ type: 'warning', text: 'PIN already exists' });
      } else if (status === 400) {
        setMessage({ type: 'info', text: 'Invalid format' });
      } else if (status === 500) {
        setMessage({ type: 'error', text: 'Server error' });
      } else {
        setMessage({ type: 'error', text: 'Network issue. Try later!' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPin(new Array(4).fill(''));
    setMessage(null);
    pinRefs.current[0]?.focus();
  };

  return (
    <div className="auth-wrapper">
        <div className="auth-card">

    <div className="logo">
   <img  src={logoMain} alt="logo" />
    </div>

      <form onSubmit={handleCreatePin} className="verifyCard">
        <h2 className="auth-heading">Create PIN</h2>
        <p className="textline">This Will be used to secure your Journal</p>
        <p className="securityline">Your journals are locked for security. Only you can access them with your PIN</p>

        <div className="pinBox">
          {pin.map((v, i) => (
            <input
              key={i}
              ref={(el) => (pinRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              pattern='\d*'
              autoComplete='one-time-code'
              value={v}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="pin"
            />
          ))}
        </div>

        <button type="submit" className="primary-btn" disabled={loading || pin.join('').length !== 4}>
          {loading ? 'Creating PIN...' : 'Continue'}
        </button>

        <p className="createpintext">
        Create a 4-digit PIN to secure your journal entries
        </p>
        </form>
</div>
        <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
      
    </div>
  );
};

export default CreatePin;
