import { useEffect } from 'react';
import { checkLockStatus } from  '../service/lock.service';

function useHeartbeat(isActive = false) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

 
    const interval = setInterval(() => {

      checkLockStatus().catch((err) => {
        console.log("Heartbeat failed:", err?.message || err);
      });

    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);
}

export default useHeartbeat;