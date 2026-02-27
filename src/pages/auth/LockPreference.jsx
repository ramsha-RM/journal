import React, { useEffect, useState } from 'react'
import { checkLockPreferences, changeLockPreferences } from '../../service/lockApi.service'
import { useAuthLock } from '../../hooks/useAuthLock';

const LockPreference = () => {
    const [preference, setPreference] = useState("off");

    useEffect(() => {
        const fetchPreferences = async () => {
        const res = await checkLockPreferences();
        setPreference(res.preference);
        };
        fetchPreferences();
    }, []);

    useAuthLock(preference);

    const handleChange = async (e) => {
        const newPreference = e.target.value;
        setPreference(newPreference);
        await changeLockPreferences({ preference: newPreference });
    };

    return (
      <select value={preference} onChange={handleChange}>
        <option value="immediately">Immediately</option>
        <option value="1min">1 minute</option>
        <option value="5min">5 minutes</option>
        <option value="10min">10 minutes</option>
        <option value="30min">30 minutes</option>
      </select>
    )
}

export default LockPreference
