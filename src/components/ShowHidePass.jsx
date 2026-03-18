import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const ShowHidePass = ({
    label, value, onChange, name
   }) => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='passwordBox'>
      {label && <label className='label'>{label}</label>}
      <div className='password-input'>
        <input type={showPassword ? "text" : "password"} autoComplete='new-password'
        value={value} onChange={onChange} name={name} className="passwordInput" />
        <button className="toggle" type='button' onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <Eye size={18} fill="#6644fc"/> : <Eye size={18}  />}
        </button>
      </div>
    </div>
  )
}

export default ShowHidePass
