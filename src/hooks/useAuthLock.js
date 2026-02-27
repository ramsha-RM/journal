import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuthLock = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(!preference || preference === "off") return;

        let timer;
        const getTimeInMs = () => {
            switch(preference) {
                case "immediately":
                return 0;
                case "1min":
                    return 60000;
                case "5min":
                    return  300000;
                case "10min":
                    return 600000;
                case "30 min":
                    return 1800000;
                default:
                    return null;
            }
        };
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                navigate("/pin/verify");
            }, getTimeInMs());
    };
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);
        document.addEventListener("visibilitychange", resetTimer);

        resetTimer();

  return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
            document.removeEventListener("visibilitychange", resetTimer);
  };
    }, [navigate, preference]);
};
