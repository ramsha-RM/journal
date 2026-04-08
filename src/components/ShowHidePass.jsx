import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const ShowHidePass = ({
    label, value, onChange, name, autoCompleteType
   }) => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='passwordBox'>
      {label && <label className='label'>{label}</label>}
      <div className='password-input'>
        <input
          type={showPassword ? "text" : "password"}
          autoComplete={autoCompleteType || "new-password"}
          value={value}
          onChange={onChange}
          name={name}
          className="passwordInput"
          data-1p-ignore="true"
        />
        <button className="toggle" type='button' onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  )
}

export default ShowHidePass
