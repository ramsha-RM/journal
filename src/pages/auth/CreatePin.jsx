import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import "../../style/authstyle/auth.css";
import "../../style/authstyle/verification.css";

import Toast from "../../components/Toast";
import logoMain from "../../assets/img/titleLogo.png";

const CreatePin = () => {
  const navigate = useNavigate();
  const { createPin } = useAuth();

  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const pinRefs = useRef([]);

  useEffect(() => {
    const hasPin = localStorage.getItem("hasPin");

    if (hasPin === "true") {
      navigate("/pin/verify");
    }
  }, [navigate]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newPin = [...pin];

      if (pin[index] === "" && index > 0) {
        pinRefs.current[index - 1]?.focus();
      }

      newPin[index] = "";
      setPin(newPin);
    }
  };


  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pasteData) return;

    const newPin = pasteData.split("");
    setPin(newPin);

    pinRefs.current[newPin.length - 1]?.focus();
  };

  const handleCreatePin = async (e) => {
    e.preventDefault();

    const pinStr = pin.join("");

    if (pinStr.length !== 4) {
      setMessage({
        type: "error",
        text: "PIN must be 4 digits",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await createPin(pinStr);
      localStorage.setItem("hasPin", "true");

      setMessage({
        type: "success",
        text: "PIN created successfully",
      });

      setTimeout(() => {
        navigate("/pin/verify");
      }, 1200);
    } catch (error) {
      // console.error("Create PIN error:", error);

      if (error?.response?.status === 409) {
        setMessage({
          type: "success",
          text: "PIN already exists. Redirecting to verify.",
        });

        setTimeout(() => {
          navigate("/pin/verify");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPin(["", "", "", ""]);
    pinRefs.current[0]?.focus();
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo">
          <img src={logoMain} alt="logo" />
        </div>

        <form onSubmit={handleCreatePin} className="verifyCard">
          <h2 className="auth-heading">Create PIN</h2>
          <p className="textline">
            This will be used to secure your Journal
          </p>
          <p className="securityline">
            Your journals are locked for security. Only you can access them
            with your PIN.
          </p>

          <div className="pinBox">
            {pin.map((value, index) => (
              <input
                key={index}
                ref={(el) => (pinRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                autoComplete="one-time-code"
                value={value}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="pin"
              />
            ))}
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading || pin.join('').length !== 4}
          >
            {loading ? 'Creating PIN...' : 'Continue'}
          </button>

          <p className="createpintext">
            Create a 4-digit PIN to secure your journal entries.
          </p>
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

export default CreatePin;