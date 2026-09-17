import React from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const EmployeeNotifications = () => {
  const notifications = [
    { title: 'Leave Application Approved', message: 'Your Casual Leave application for Aug 14 - Aug 15 has been approved by HR.', date: 'Today, 09:30 AM', type: 'success' },
    { title: 'Monthly Payslip Published', message: 'Your salary payslip for August 2026 is now available for download.', date: 'Yesterday', type: 'info' },
    { title: 'Townhall Meeting Reminder', message: 'Annual Townhall starts at 02:00 PM today in Main Conference Hall.', date: '2 days ago', type: 'info' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">System Alerts & Notifications</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {notifications.map((n, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  {n.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Info size={16} className="text-blue-600 shrink-0" />}
                  <span className="text-xs font-semibold text-slate-500">{n.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{n.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotifications;
