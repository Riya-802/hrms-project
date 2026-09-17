import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case 'Active':
      case 'Completed':
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
      case 'On Leave':
      case 'Part-time':
      case 'Contract':
      case 'Late':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending':
      case 'Inactive':
      case 'Rejected':
      case 'Terminated':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotStyle = (statusVal) => {
    switch (statusVal) {
      case 'Active':
      case 'Completed':
      case 'Approved':
        return 'bg-emerald-500';
      case 'In Progress':
      case 'On Leave':
      case 'Part-time':
      case 'Contract':
      case 'Late':
        return 'bg-amber-500';
      case 'Pending':
      case 'Inactive':
      case 'Rejected':
      case 'Terminated':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle(status)}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
