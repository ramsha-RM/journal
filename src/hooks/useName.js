import { useState, useEffect  } from "react";

export const useName = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUserName(storedName);
    else setUserName("User");
  }, []);

  const updateName = (name) => {
    setUserName(name);
    localStorage.setItem("username", name);
  };

  return [ userName, updateName ]; 
};