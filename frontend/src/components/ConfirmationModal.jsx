import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const ConfirmationModal = () => {
  const { modalState, closeModal } = useHRMS();

  if (!modalState.isOpen) return null;

  const { title, message, confirmText, onConfirm, type } = modalState;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle color={type === 'danger' ? '#ef4444' : '#3b82f6'} size={20} />
            <h3>{title || 'Confirm Action'}</h3>
          </div>
          <button className="toast-close" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p>{message || 'Are you sure you want to proceed with this action?'}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
