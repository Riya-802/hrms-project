import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  const getColorStyles = (colorName) => {
    switch (colorName) {
      case 'success':
      case 'green':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'warning':
      case 'amber':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'info':
      case 'sky':
        return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'danger':
      case 'red':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'primary':
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm transition hover:shadow-md">
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${getColorStyles(color)}`}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
