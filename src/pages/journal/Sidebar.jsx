import React from "react";
import logoMain from "../../assets/img/titleLogo.png";
import DashboardImg from "../../assets/icons/dashboardedit.png";
import JournalImg from "../../assets/icons/journal.png";
import AddJournalImg from "../../assets/icons/addjournal.png";
import ProfileImg from "../../assets/icons/profile.png";
import SettingImg from "../../assets/icons/setting.png";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import AdminRoute from "../../assets/icons/admin-panel.png";

import "../../style/DashboardStyle/sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isAdmin }) => {
  return (
    <div className="sidebar">
      <img src={logoMain} alt="logo" className="logo" />

      <div className="sidebarTags">
        <NavLink to="/dashboard" className="iconText">
          <img src={DashboardImg} alt="" /> Dashboard
        </NavLink>

        <NavLink to="/journals" className="iconText" end>
          <img src={JournalImg} alt="" /> Journals
        </NavLink>

        <NavLink to="/create" className="iconText">
          <img src={AddJournalImg} alt="" /> Add Journals
        </NavLink>

        <NavLink to="/profile" className="iconText">
          <img src={ProfileImg} alt="" /> Profile
        </NavLink>

        <NavLink to="/setting" className="iconText">
          <img src={SettingImg} alt="" /> Settings
        </NavLink>

        {/* <NavLink to="/admin" className="iconText">
          <img src={AdminRoute} alt="" /> Admin Panel
        </NavLink> */}
        {isAdmin && (
          <NavLink to="/admin" className="iconText">
            <img src={SettingImg} alt="" /> Admin Panel
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
