import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const Toast = () => {
  const { toasts, removeToast } = useHRMS();

  if (!toasts || !toasts.length) return null;

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-slate-900 text-white border-slate-800 shadow-slate-900/20';
      case 'danger':
      case 'error':
        return 'bg-rose-900 text-white border-rose-800 shadow-rose-900/20';
      case 'info':
      default:
        return 'bg-slate-900 text-white border-slate-800 shadow-slate-900/20';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-md w-[calc(100%-2.5rem)] sm:w-auto">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border shadow-xl text-sm font-medium transition duration-200 ${getToastStyles(toast.type)}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
            {(toast.type === 'error' || toast.type === 'danger') && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-sky-400 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition p-1 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
