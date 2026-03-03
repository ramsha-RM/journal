import React from 'react';

const MoodProgress = ({ label, percentage = 0, color = '#4318FF', emoji = '' }) => {
  const width = Math.min(Math.max(Number(percentage), 0), 100);

  return(
  <div className="progress-container">
    <div className="emoji-col">{emoji}</div>
    <div className="content-col">
      <div className="text-row">
        <span>{label}</span>                    
        <span>{Math.round(width)}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${width}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  </div>
)
};
export default MoodProgress;
