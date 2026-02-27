import React from 'react';

const MoodProgress = ({ label, percentage = 0, color = '#4318FF', emoji = '' }) => (
  <div className="progress-container">
    <div className="emoji-col">{emoji}</div>
    <div className="content-col">
      <div className="text-row">
        <span>{label}</span>
        <span>{percentage}</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  </div>
);

export default MoodProgress;
