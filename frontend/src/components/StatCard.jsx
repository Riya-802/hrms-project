import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className={`stat-icon-wrapper ${color}`}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
