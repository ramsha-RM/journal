import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import OtpInput from "../../components/OtpInput";
import { useNavigate } from "react-router-dom";
import API from '../../service/api.interceptor';
import Toast from "../../components/Toast";
import logoMain from "../../assets/img/titleLogo.png";

const Verification = () => {
  const navigate = useNavigate();
  const { verifyAccount } = useAuth();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [resendDisable, setResendDisable] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const email = localStorage.getItem("pendingEmail");

    if (!email)
      return setMessage({
        type: "error",
        text: "Session expired. Please sign up again.",
      });

    if (otp.length !== 6)
      return setMessage({ type: "warning", text: "Enter 6-digit code!" });

    try {
      const res = await verifyAccount({ email, otp });

      setMessage({
        type: "success",
        text: "Account verified successfully. You are now logged in.",
      });

      localStorage.removeItem("pendingEmail");

      if (!res?.hasPin) navigate("/pin/create");
      else navigate("/pin/verify");
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Something went wrong. Try again!",
      });
    }
  };

  const handleResend = async () => {
    if (resendDisable) return;

    setResendDisable(true);
    setResendTimer(26);

    const email = localStorage.getItem("pendingEmail");

    if (!email)
      return setMessage({
        type: "error",
        text: "Session expired. Please sign up again.",
      });

    try {
      await API.post("/auth/resend-otp", { email });

      setMessage({ type: "success", text: "OTP resent successfully!" });
      setOtp("");

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisable(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Something went wrong!",
      });
      setResendTimer(0);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo">
          <img src={logoMain} alt="logo" />
        </div>

        <form onSubmit={handleSubmit} className="verifyCard">
          <h1 className="auth-heading">Verify Your Email</h1>
          <p className="textline">We’ve sent a 6-digit code to</p>
          <p className="pendingEmail">
            {localStorage.getItem("pendingEmail")}
          </p>

          <OtpInput length={6} onChange={setOtp} />

          <button
            type="submit"
            className="primary-btn"
            disabled={otp.length !== 6}
          >
            Verify
          </button>

          <div className="lastText">
            <p className="text">Resend OTP in {resendTimer || 26} seconds</p>
            <span
              onClick={() => {
                localStorage.removeItem("pendingEmail");
                navigate("/register");
              }}
            >
              Back to Sign Up
            </span>
          </div>
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

export default Verification;