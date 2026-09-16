import React from 'react';

const StatusBadge = ({ status }) => {
  const isPendingOrActive = status === 'Active';
  
  return (
    <span className={`badge ${isPendingOrActive ? 'badge-active' : 'badge-inactive'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
