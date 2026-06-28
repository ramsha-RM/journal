import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { changeLockPreferences, checkLockPreferences } from '../../service/lock.service';
import Sidebar from "../journal/Sidebar";
import { useName } from "../../hooks/useName";
import Toast from "../../components/Toast";
import "../../style/dashboardstyle/dashboardLayout.css";
import "../../style/dashboardstyle/setting.css";

const AppLock = () => {
  const navigate = useNavigate();
  const [userName] = useName();
  const navigationTimeoutRef = useRef(null);

  const VALID_PREFERENCES = ['off', 'immediately', '1', '5', '10', '30'];

  const normalizeVal = (val) => {
    if (!val) return "off";
    const cleanVal = val.toString().split(" ")[0];
    return VALID_PREFERENCES.includes(cleanVal) ? cleanVal : "off";
  };

  const [preferences, setPreferences] = useState(() =>
    normalizeVal(localStorage.getItem("app_lock"))
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await checkLockPreferences();
        if (data?.preferences) {
          const normalized = normalizeVal(data.preferences);
          setPreferences(normalized);
          localStorage.setItem("app_lock", normalized); 
        }
      } catch (err) {
        console.log("Failed to load lock preferences", err);
      }
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    let apiVal = preferences;
    if (["1", "5", "10", "30"].includes(preferences)) {
      apiVal = `${preferences} min`;
    }

    try {
      await changeLockPreferences({ preferences: apiVal });

      localStorage.setItem("app_lock", preferences);

      setMessage({ type: "success", text: "Auto-lock preferences updated successfully!" });

      navigationTimeoutRef.current = setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const errorMsg = error?.response?.data?.[0] || error?.response?.data?.message || error?.message || "Failed to update preferences";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='dashboard-container'>
      <Sidebar />
      <Toast
        show={!!message}
        message={message?.text}
        type={message?.type}
        onClose={() => setMessage(null)}
      />

      <div className='main-content'>
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName || "User"},</p>
            <h1>Welcome to Notevia!</h1>
          </div>
        </header>

        <main className="setting-box">
          <h2 className="headingSetting">App Lock</h2>
          <div className="card" style={{ padding: '25px' }}>
            <div className="app-lock-group">
              <p style={{ marginBottom: '15px', color: '#4a5578', fontWeight: '500' }}>
                Select how long the app stays active before requiring your PIN:
              </p>

              {[
                { label: 'Off', value: 'off' },
                { label: 'Immediately', value: 'immediately' },
                { label: '1 minute', value: '1' },
                { label: '5 minutes', value: '5' },
                { label: '10 minutes', value: '10' },
                { label: '30 minutes', value: '30' }
              ].map((item) => (
                <label key={item.value} className="label">
                  <input
                    type="radio"
                    name="appLock"
                    value={item.value}
                    checked={preferences === item.value}
                    onChange={(e) => setPreferences(e.target.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}

              <hr style={{ margin: '20px 0' }} />

              <button
                className="primary-btn"
                onClick={handleSave}
                disabled={loading}
                style={{ width: '100%', maxWidth: '200px' }}
              >
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLock;