import React from 'react'
import "../style/DashboardStyle/logout.css"

const LogoutMsg = ({ show, onConfirm, onCancel }) => {
    if(!show) return null;

  return (
    <div className='modal-overlay-logout'>
        <div className='modal-content'>
           <h3 className='log-heading'>⚠️ Are you sure you want to Logout!</h3>
           <p className='log-msg'>"Your workspace will be cleared until your next login. Everything is safely synced.</p>
           <div className='log-actions'>
            <button className='yesbtn' onClick={onCancel}>Keep active</button>
            <button className='nobtn' onClick={onConfirm}>Power down</button>
           </div>
        </div>
    </div>
  )
}

export default LogoutMsg