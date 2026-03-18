import { useState, useEffect } from "react";

export const useName = () => {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("username") || "User";
  });

  const updateName = (name) => {
    setUserName(name);
    localStorage.setItem("username", name);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedName = localStorage.getItem("username") || "User";
      setUserName(storedName);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return [userName, updateName];
};