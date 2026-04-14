import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../journal/Sidebar";
import Toast from "../../components/Toast";
import LogoutMsg from "../../components/LogoutMsg";
import Skeleton from "../../components/Skeleton";
import API from "@/service/axios";

import "../../style/dashboardstyle/profile.css";
import "../../style/dashboardstyle/dashboardLayout.css";

import ProImg from "../../assets/icons/profile.png";
import UserImg from "../../assets/icons/profile-edit.svg";
import { useName } from "../../hooks/useName";
import { useProfile } from "../../hooks/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Main switch
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const hasCustomimg = profileImg && profileImg !== UserImg && profileImg !== ProImg;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsInitialLoading(true);
        const res = await API.get("/profiles/me");
        const data = res.data;

        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setDob(data.date_of_birth || "");
        
        const token = localStorage.getItem("access_token");
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
          setEmail(payload.email);
        }

        if (data.profile_picture) {
          setProfilePic(data.profile_picture);
          updateProfileImage(data.profile_picture);
        }

        if (data.created_at) {
          const created = new Date(data.created_at);
          setJoinedDate(`Joined ${created.toLocaleDateString(undefined, { year: "numeric", month: "short" })}`);
        }

        updateName(data.full_name || "User");
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


  return (
    <div className="dashboard-container">
      <Sidebar />
      <Toast show={!!message} message={message?.text} type={message?.type} onClose={() => setMessage(null)} />
      <LogoutMsg show={showLogout} onConfirm={() => { localStorage.clear(); navigate("/"); }} onCancel={() => setShowLogout(false)} />

      <main className="main-content">
        <header className="top-header">
          <div className="welcome-section">
            {isInitialLoading ? (
              <>
                <Skeleton width="80px" height="18px" style={{ marginBottom: "8px" }} />
                <Skeleton width="250px" height="32px" />
              </>
            ) : (
              <>
                <p>Hi {userName || "User"},</p>
                <h1>Welcome to Notevia!</h1>
              </>
            )}
          </div>

          <div className="profile-sec">
            <div className="profile-circle">
              {isInitialLoading ? (
                <Skeleton width="100%" height="100%" borderRadius="50%" />
              ) : (
                <img className={!profileImg ? "default-icon" : ""} src={profileImg || ProImg} alt="profile" />
              )}
            </div>
          </div>
        </header>

        <div className="profile-box">
           {loading ? (
              <Skeleton width="20%" height="30px" style={{ marginBottom: "30px" }} />
            ) : (
          <h3 className="heading">Profile</h3>
          )}  
          <div className="profile-form">
            {isInitialLoading ? (
              <div className="skeleton-form-wrapper">
                 {/* Profile Image & Header Skeleton */}
                <div className="userdata">
                  <Skeleton width="80px" height="80px" borderRadius="50%" />
                  <div style={{ marginLeft: "15px" }}>
                    <Skeleton width="150px" height="20px" style={{ marginBottom: "10px" }} />
                    <Skeleton width="100px" height="15px" />
                  </div>
                </div>
                {/* Inputs Skeletons */}
                <div className="name-email" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <div style={{ flex: 1 }}><Skeleton height="45px" /></div>
                    <div style={{ flex: 1 }}><Skeleton height="45px" /></div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Skeleton height="100px" />
                </div>
                <div className="profile-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <Skeleton width="100px" height="40px" />
                    <Skeleton width="150px" height="40px" />
                    <Skeleton width="120px" height="40px" style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            ) : (
              <>
                {/* Your actual profile form JSX */}
                <div className="userdata">
                  <div className="edit-img">
                    <img src={profilePic} alt="Profile" className={hasCustomimg ? "profile-image uploaded" : "profile-image default"} />
                    <input type="file" accept="image/*" onChange={(e) => {/* image logic */}} />
                  </div>
                  <div className="username-date">
                    <p className="username">{userName}</p>
                    <p className="joineddate">{joinedDate}</p>
                  </div>
                </div>
                {/* Form Inputs... */}
                <div className="name-email">
                  <div className="namebox">
                    <label>Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="emailbox">
                    <label>Email</label>
                    <input type="email" value={email} readOnly />
                  </div>
                </div>
                {/* Rest of the form... */}
                <div className="textareabox">
                  <label>Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className="profile-buttons">
                  <button className="logout-p-btn" onClick={() => setShowLogout(true)}>Logout</button>
                  <button className="change-pass-btn" onClick={() => navigate("/password/change")}>Change Password</button>
                  <button className="save-btn" onClick={() => {/* save logic */}} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;