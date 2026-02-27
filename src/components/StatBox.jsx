import React from 'react';

const StatBox = ({ label, value, icon, className = '', iconBg }) => (
  <div className={`stat-card ${className}`}>
    <div className="stat-info">
      {icon && (
        <div className="stat-icon-wrapper" style={{ backgroundColor: iconBg }}>
          <img src={icon} alt="icon" className="stat-icon" />
        </div>
      )}
      <div className="info">
        <span className="label">{label}</span>
        <h3 className="value">{value}</h3>
      </div>
    </div>
  </div>
);

export default StatBox;
