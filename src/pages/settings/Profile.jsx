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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const isUploaded = profileImg && profileImg !== UserImg;
  const hasCustomimg = profileImg === UserImg || profileImg === ProImg || !profileImg;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await API.get("/profiles/me");
        const data = res.data;

        setFullName(data.full_name || localStorage.getItem("username") || "");
        setBio(data.bio || "");
        setDob(data.date_of_birth || "");
        setEmail(data.email || localStorage.getItem("pendingEmail") || "");

        const name = data.full_name || localStorage.getItem("username") || "User";
        updateName(name);
        localStorage.setItem("username", name);

    const token = localStorage.getItem("access_token");
    if (token) {
     const payload = JSON.parse(atob(token.split('.')[1]));
     setEmail(payload.email);
      }
        if (data.profile_picture) {
          setProfilePic(data.profile_picture);
          updateProfileImage(data.profile_picture);
        }

        if (data.created_at) {
          const created = new Date(data.created_at);
          const options = { year: "numeric", month: "short" };

          setJoinedDate(
            `Joined ${created.toLocaleDateString(undefined, options)}`
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        } else {
          setMessage({ type: "error", text: "Failed to load profile" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setProfilePic(preview);
    setNewPic(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("bio", bio || "");
      if (dob) formData.append("date_of_birth", dob);

      if (newPic) {
        formData.append("profile_picture", newPic);
      }

      const res = await API.patch("/profiles/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const savedImg = res.data.profile_picture;

      if (savedImg) {
        setProfilePic(savedImg);
        updateProfileImage(savedImg);
      }

      updateName(fullName);
      localStorage.setItem("username", fullName);
      setNewPic(null);

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      {message && (
        <Toast
          show={true}
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)} /> )}

        <LogoutMsg
        show={showLogout}
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)} />

      <main className="main-content">
        <header className="top-header">
          <div className="welcome-section">
            <p>Hi {userName || "User"},</p>
            <h1>Welcome to Notevia!</h1>
          </div>

          <div className="profile-circle">
          <img src={profilePic && profilePic !== UserImg && profilePic !== ProImg ? profilePic : ProImg} 
          alt="Profile" className={profilePic && profilePic !== UserImg && profilePic !== ProImg ? "uploaded" : "default-icon"}
        />
      </div>
        </header>

        <div className="profile-box">
          <h3 className="heading">Profile</h3>

          <div className="profile-form">
            <div className="userdata">
              <div className="edit-img">
            <img src={hasCustomimg ? UserImg : profileImg} alt="Profile" className={profilePic && profilePic !== UserImg 
            ? "profile-image uploaded" : "profile-image default"} />

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
             <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
               placeholder="Enter your full name" />
              </div>

              <div className="emailbox">
                <label>Email</label>
                <input type="email" value={email} readOnly />
              </div>
            </div>

            <div className="textareabox">
              <label>Bio</label>
              <textarea value={bio}  onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..." />
            </div>

            <div className="profile-buttons">
              <button className="logout-btn" onClick={() => setShowLogout(true)}> Logout</button>

              <button className="change-pass-btn" onClick={() => navigate("/password/change")} > Change Password </button>

              <button className="save-btn" onClick={handleSave}  disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;