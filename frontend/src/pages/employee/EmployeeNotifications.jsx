import React from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const EmployeeNotifications = () => {
  const notifications = [
    { title: 'Leave Application Approved', message: 'Your Casual Leave application for Aug 14 - Aug 15 has been approved by HR.', date: 'Today, 09:30 AM', type: 'success' },
    { title: 'Monthly Payslip Published', message: 'Your salary payslip for August 2026 is now available for download.', date: 'Yesterday', type: 'info' },
    { title: 'Townhall Meeting Reminder', message: 'Annual Townhall starts at 02:00 PM today in Main Conference Hall.', date: '2 days ago', type: 'info' }
  ];

  return (
    <div className="employee-page-container">
      <div className="emp-card">
        <div className="emp-card-header">
          <h3>System Alerts & Notifications</h3>
        </div>
        <div className="emp-card-body">
          <div className="announcement-list">
            {notifications.map((n, i) => (
              <div key={i} className="announcement-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {n.type === 'success' ? <CheckCircle2 size={16} color="#10b981" /> : <Info size={16} color="#2563eb" />}
                  <span className="announcement-date">{n.date}</span>
                </div>
                <h4 className="announcement-title">{n.title}</h4>
                <p className="announcement-desc">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotifications;
