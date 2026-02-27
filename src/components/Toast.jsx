import React from 'react';

const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;
  return (
    <div className={`toast-box ${type}`}>
      <span className="toast-icon">{type === 'error' ? '⚠️' : '✅'}</span>
      <span style={{ flex: 1 }}>
        {typeof message === 'object' ? JSON.stringify(message) : message}
      </span>
      {onClose && (
        <button className="closeBtn" onClick={onClose} aria-label="Close">❌</button>
      )}
    </div>
  );
};

export default Toast;
