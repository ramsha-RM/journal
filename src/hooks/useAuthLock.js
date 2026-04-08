import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthLock = (preference) => {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!preference || preference === "off" || location.pathname === "/pin/verify") {
      return;
    }

    const getTimeInMs = () => {

      const val = preference.toString().split(" ")[0]; 
      
      switch (val) {
        case "immediately": return "instant"; 
        case "1": return 60000;
        case "5": return 300000;
        case "10": return 600000;
        case "30": return 1800000;
        default: return null;
      }
    };

    const time = getTimeInMs();

    // 🔥 Immediate lock (on tab/app leave)
    if (time === "instant") {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          navigate("/pin/verify", { state: { isTimeout: true } });
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    if (!time) return;

    const lockApp = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (location.pathname !== "/pin/verify") {
          navigate("/pin/verify", { state: { isTimeout: true } });
        }
      }, time);
    };

    const resetTimer = () => lockApp();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    document.addEventListener("visibilitychange", resetTimer);

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
      document.removeEventListener("visibilitychange", resetTimer);
    };
  }, [navigate, preference, location.pathname]);
};