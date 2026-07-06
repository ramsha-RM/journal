import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import OtpInput from "../../components/OtpInput";
import "../../style/AuthStyle/auth.css";
import "../../style/AuthStyle/verification.css";
import Toast from "../../components/Toast";
import logoMain from "../../assets/img/titleLogo.png";

const CreatePin = () => {
  const navigate = useNavigate();
  const { createPin } = useAuth();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const isChanging = localStorage.getItem("hasPin") === "true";

  const handleCreatePin = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) {
      setMessage({ type: "error", text: "PIN must be 4 digits" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await createPin(pin);
      localStorage.setItem("hasPin", "true");

      setMessage({ type: "success", text: "PIN created successfully" });

      setTimeout(() => {
        if (isChanging) {
          window.location.replace("/dashboard");
        } else {
          navigate("/pin/verify");
        }
      }, 1200);
    } catch (error) {
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

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo">
          <img src={logoMain} alt="logo" />
        </div>

        <form onSubmit={handleCreatePin} className="verifyCard">
          <h2 className="auth-heading">Create PIN</h2>
          <p className="textline">"This will be used to secure your Journal"</p>
          <p className="securityline">
            Your journals are locked for security. Only you can access them
            with your PIN.
          </p>

          <OtpInput length={4} onChange={setPin} />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading || pin.length !== 4}
          >
            {loading ? "Creating PIN..." : "Continue"}
          </button>

          <p className="createpintext">
            "Create a 4-digit PIN to secure your journal entries."
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