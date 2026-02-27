import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = variant === 'primary' ? 'primary-btn' : 'btn-secondary';
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
