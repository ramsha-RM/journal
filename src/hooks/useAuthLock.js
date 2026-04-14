import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthLock = (preference) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const preferenceRef = useRef(preference);


  useEffect(() => {
    preferenceRef.current = preference;
  }, [preference]);

  useEffect(() => {
    const currentPref = preferenceRef.current;

    if (!currentPref || currentPref === "off" || window.location.pathname === "/pin/verify") {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const getTimeoutMs = (pref) => {
      const val = pref.toString().split(" ")[0];

      switch (val) {
        case "immediately": return 0;           
        case "1": return 60 * 1000;
        case "5": return 5 * 60 * 1000;
        case "10": return 10 * 60 * 1000;
        case "30": return 30 * 60 * 1000;
        default: return null;
      }
    };

    const timeoutMs = getTimeoutMs(currentPref);

    if (timeoutMs === 0) {
      const handleVisibility = () => {
        if (document.visibilityState === "hidden") {
          navigate("/pin/verify", { 
            replace: true, 
            state: { from: window.location.pathname, isTimeout: true } 
          });
        }
      };

      document.addEventListener("visibilitychange", handleVisibility);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }

    if (!timeoutMs) return;

    const startLockTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {

        if (window.location.pathname !== "/pin/verify") {
          navigate("/pin/verify", { 
            replace: true, 
            state: { from: window.location.pathname, isTimeout: true } 
          });
        }
      }, timeoutMs);
    };

    const resetTimer = () => startLockTimer();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart", "touchmove"];

    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));
    document.addEventListener("visibilitychange", resetTimer);

    startLockTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      events.forEach(event => window.removeEventListener(event, resetTimer));
      document.removeEventListener("visibilitychange", resetTimer);
    };
  }, [navigate]); 
};