import { useState, useEffect, useCallback } from "react";

export const useProfile = () => {
  const [profileImg, setProfileImg] = useState(() => {
    return localStorage.getItem("profileImg") || null;
  });

  const updateProfileImage = useCallback((img) => {
    setProfileImg(img);
    if (img) localStorage.setItem("profileImg", img);
  }, []);


  useEffect(() => {
    const handleStorageChange = () => {
      setProfileImg(localStorage.getItem("profileImg"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { profileImg, updateProfileImage };
};