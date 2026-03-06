// import { useState, useEffect } from "react";

// export const useProfile = () => {
//   const [profileImg, setProfileImg] = useState(null);

//   useEffect(() => {
//     const storedImg = localStorage.getItem("profileImg");
//     if (storedImg) setProfileImg(storedImg);

//     const handleStoreImg = () => {
//       const updateImg = localStorage.getItem("profileImg");
//       setProfileImg(updateImg);
//     };
//     window.addEventListener("storage", handleStoreImg);

//     return() => {
//       window.removeEventListener("storage", handleStoreImg);
//     };
//   }, []);

//   const updateProfileImage = (img) => {
//     setProfileImg(img);
//     localStorage.setItem("profileImg", img);
//   };

//   return { profileImg, updateProfileImage }; 
// };

import { useState, useEffect } from "react";

export const useProfile = () => {
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const storedImg = localStorage.getItem("profileImg");
    if (storedImg) setProfileImg(storedImg);
  }, []);

  const updateProfileImage = (img) => {
    setProfileImg(img);
    localStorage.setItem("profileImg", img);
  };

  return { profileImg, updateProfileImage };
};