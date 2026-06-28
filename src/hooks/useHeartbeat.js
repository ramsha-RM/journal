import { useEffect } from 'react';
import { checkLockStatus } from  '../service/lock.service';

function useHeartbeat(isActive = false) {
  useEffect(() => {
    if (!isActive) {
      console.log("🚫 Heartbeat not active");
      return;
    }

    console.log("🔥 Heartbeat Mounted");
 
    const interval = setInterval(() => {
      console.log("⏱ Heartbeat Tick");

      checkLockStatus().catch((err) => {
        console.log("Heartbeat failed:", err?.message || err);
      });

    }, 10000);

    return () => {
      console.log("❌ Heartbeat Cleaned");
      clearInterval(interval);
    };
  }, [isActive]);
}

export default useHeartbeat;