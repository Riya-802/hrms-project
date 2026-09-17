import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const ConfirmationModal = () => {
  const { modalState, closeModal } = useHRMS();

  if (!modalState || !modalState.isOpen) return null;

  const { title, message, confirmText, onConfirm, type } = modalState;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4" onClick={closeModal}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 transition transform animate-in fade-in zoom-in duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={type === 'danger' ? 'text-rose-600' : 'text-blue-600'} size={20} />
            <h3 className="font-bold text-slate-900 text-base">{title || 'Confirm Action'}</h3>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-slate-600 leading-relaxed">{message || 'Are you sure you want to proceed with this action?'}</p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition shadow-sm" 
            onClick={closeModal}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition ${
              type === 'danger' 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`} 
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
