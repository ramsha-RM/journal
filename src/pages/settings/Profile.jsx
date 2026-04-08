import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../journal/Sidebar";
import "../../style/dashboardstyle/profile.css";
import "../../style/dashboardstyle/dashboardLayout.css";
import Toast from "../../components/Toast";
import API from "@/service/axios";
import ProImg from "../../assets/icons/profile.png";
import UserImg from "../../assets/icons/profile-edit.svg";
import { useName } from "../../hooks/useName";
import { useProfile } from "../../hooks/useProfile";
import LogoutMsg from "../../components/LogoutMsg";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, updateName] = useName();
  const { profileImg, updateProfileImage } = useProfile();
  const [showLogout, setShowLogout] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(UserImg);
  const [newPic, setNewPic] = useState(null);
  const [joinedDate, setJoinedDate] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const hasCustomimg = profileImg && profileImg !== UserImg && profileImg !== ProImg;

useEffect(() => {

  const cachedName = localStorage.getItem("username");
  const cachedImg = localStorage.getItem("profileImg");
  const cachedBio = localStorage.getItem("bio");
  const cachedDob = localStorage.getItem("dob");

  if (cachedName) {
    setFullName(cachedName);
    updateName(cachedName);
  }
  if (cachedImg) {
    setProfilePic(cachedImg);
    updateProfileImage(cachedImg);
  }
  if (cachedBio) setBio(cachedBio);
  if (cachedDob) setDob(cachedDob);

  const fetchProfile = async () => {
    try {
      setIsInitialLoading(true);
      const res = await API.get("/profiles/me");
      const data = res.data;

      setFullName(data.full_name || cachedName || "");
      setBio(data.bio || "");
      setDob(data.date_of_birth || "");

      const token = localStorage.getItem("access_token");
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          setEmail(payload.email);
        }
      }

      if (data.profile_picture) {
        setProfilePic(data.profile_picture);
        updateProfileImage(data.profile_picture);
        localStorage.setItem("profileImg", data.profile_picture); // ⭐ FIXED KEY
      }

      if (data.created_at) {
        const created = new Date(data.created_at);
        setJoinedDate(
          `Joined ${created.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
          })}`
        );
      }

      const name = data.full_name || cachedName || "User";
      updateName(name);
      localStorage.setItem("username", name);

      localStorage.setItem("bio", data.bio || "");
      localStorage.setItem("dob", data.date_of_birth || "");

    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      } else {
        setMessage({ type: "error", text: "Failed to load profile" });
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  fetchProfile();
}, [navigate, updateName, updateProfileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(URL.createObjectURL(file));
    setNewPic(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let res;

      if (newPic) {
        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("bio", bio || "");
        if (dob) formData.append("date_of_birth", dob);
        formData.append("profile_picture", newPic);

        res = await API.patch("/profiles/me", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        const payload = { full_name: fullName, bio: bio || "" };
        if (dob) payload.date_of_birth = dob;
        res = await API.patch("/profiles/me", payload);
      }

      if (res.data.profile_picture) {
        setProfilePic(res.data.profile_picture);
        updateProfileImage(res.data.profile_picture);
      }

      updateName(fullName);
      localStorage.setItem("username", fullName);
      setNewPic(null);
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (error) {
      const errRes = error?.response?.data?.message;
      const errorText = Array.isArray(errRes) ? errRes[0] : errRes || "Update failed";
      setMessage({ type: "error", text: errorText });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
      <LogoutMsg show={showLogout} onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />

      <main className="main-content">
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName || "User"},</p>
            <h1>Welcome to Notevia!</h1>
          </div>
          <div className="profile-sec">
            <div className="profile-circle">
            {/* <img src={profilePic} alt="Profile" className={hasCustomimg ? "uploaded" : "default-icon"} /> */}
            <img className={!profileImg ? "default-icon" : ""}  src={profileImg || ProImg} alt="profile" />
            
            </div>
          </div>
        </header>

        <div className="profile-box">
          <h3 className="heading">Profile</h3>
          <div className="profile-form">
            <div className="userdata">
              <div className="edit-img">
                <img src={profilePic} alt="Profile" className={hasCustomimg ? "profile-image uploaded" : "profile-image default"} />
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="username-date">
                <p className="username">{userName}</p>
                <p className="joineddate">{joinedDate}</p>
              </div>
            </div>

            <div className="name-email">
              <div className="namebox">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
              </div>
              <div className="emailbox">
                <label>Email</label>
                <input type="email" value={email} readOnly />
              </div>
            </div>

            <div className="textareabox">
              <label>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write something about yourself..." />
            </div>

            <div className="profile-buttons">
              <button className="logout-p-btn" onClick={() => setShowLogout(true)}>Logout</button>
              <button className="change-pass-btn" onClick={() => navigate("/password/change")}>Change Password</button>
              <button className="save-btn" onClick={handleSave} disabled={isSaving || isInitialLoading}>
                {isSaving ? <><span className="spinner"></span> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;