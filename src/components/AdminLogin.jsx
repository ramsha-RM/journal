import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import logoImg from "../assets/img/titleLogo.png";

import "../style/AdminPgStyle/adminLogin.css";
import "../style/AuthStyle/auth.css";

const AdminLogin = () => {
  const [adminPassKey, setAdminPassKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { verifyAdminKey } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminPassKey.trim()) {
      setError("Admin pass key is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await verifyAdminKey(adminPassKey);

      navigate("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid admin pass key"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="logo">
          <img src={logoImg} alt="Notevia Logo" />
        </div>

        <form onSubmit={handleSubmit} className="signupBox">

          <h2 className="auth-heading">
            Admin Login
          </h2>

          <p className="textline">
            Enter your admin pass key to continue
          </p>

          <div className="adminPasskeyBox">
            <label className="admin-label">
              Admin Pass Key
            </label>

            <input
              type="password"
              className="admin-pass-input"
              placeholder="Enter Admin Pass Key"
              value={adminPassKey}
              onChange={(e) =>
                setAdminPassKey(e.target.value)
              }
              autoComplete="current-password"
            />
          </div>

          {error && (
            <span className="admin-error">
              {error}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;