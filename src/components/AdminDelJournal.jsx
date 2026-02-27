import React, {useState} from 'react'
import { adminDeleteJournal } from '../service/journal.service';
import '../style/dashboardstyle/deleteModal.css';

const AdminDelJournal = ({show, onClose, onDelete, journalTitle, requireAdmin}) => {
    const [adminKey, setAdminKey] = useState('');

    if(!show) return null;

    const handleDelete = async () => {
        if(requireAdmin) {
            if(!adminKey.trim()) {
                alert("Admin key is required");
                return;
            }
            onDelete(adminKey.trim());
        } else {
            onDelete();
        }
    };

  return (
    <div className='modal-overlay' onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>

      <div className="modal-content">
        <h2 className='modal-heading'>Delete confirm</h2>
        <p className='modal-text'>Are you sure you want to delete "{journalTitle}"?</p>
        {requireAdmin && (
          <input
            type="password"
            placeholder="Enter admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className='modal-input'
          />
        )}
        <div className="modal-actions">
        <button className='confirm-btn' onClick={handleDelete} 
        disabled={requireAdmin && !adminKey.trim()}>Confirm Delete</button>
        <button className='cancel-btn' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>

  )
}

export default AdminDelJournal
