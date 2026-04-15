import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "../../components/OtpInput";
import useAuth from "@/hooks/useAuth";
import logoImg from "../../assets/img/titleLogo.png";
import "../../style/authstyle/auth.css";
import "../../style/authstyle/verification.css";
import Toast from "../../components/Toast";

const VerifyPin = () => {
  const navigate = useNavigate();
  const { verifyPin } = useAuth();
  const location = useLocation();

  const [pin, setPin] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const isTimeout = location.state?.isTimeout || false;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setMessage(null);
    const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";

    if (pin.length !== 4) {
      setMessage({ type: "error", text: "Please enter your 4-digit PIN!" });
      return;
    }

    setLoading(true);

    try {
      const res = await verifyPin(pin);
      const token = res?.accessToken || res?.token || res?.access_token;

      if (token) {
        localStorage.setItem(ACCESS_KEY, token);
      }
      if (res?.userId) {
        localStorage.setItem("userId", res.userId);
      }

      localStorage.removeItem("login_token");

      setMessage({ type: "success", text: "PIN confirmed! Unlocking..." });

      const pendingPath = localStorage.getItem("pendingRedirectAfterPin");

      setTimeout(() => {
        if (pendingPath) {
          localStorage.removeItem("pendingRedirectAfterPin");
          navigate(pendingPath, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 800);
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid PIN. Please try again.";
      setMessage({ type: "error", text: serverMsg });
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
        <form onSubmit={handleSubmit} className="verifyCard">
          <h2 className="auth-heading">
            {isTimeout ? "Session Locked" : "Confirm your PIN"}
          </h2>
          <p className="textline">
            {isTimeout
              ? "Enter your PIN to continue."
              : "Please confirm your PIN"}
          </p>
          <p className="securityline">
            {isTimeout
              ? "Your session is locked for security. Only you can access it with your PIN."
              : "Your journals are locked for security. Only you can access them with your PIN."
               }
          </p>
          <OtpInput length={4} onChange={setPin} />

          <button
            disabled={pin.length !== 4 || loading}
            type="submit"
            className="primary-btn"
          >
            {loading ? "Verifying..." : isTimeout ? "Unlock" : "Continue"}
          </button>

          {!isTimeout && (
            <p className="verifyText">
              Need to reset?{" "}
              <span onClick={() => navigate("/pin/create")}>
                Change PIN
              </span>
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