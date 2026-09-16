import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Play, Square } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

const EmployeeAttendance = () => {
  const { addToast } = useHRMS();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:52 AM');

  const attendanceLog = [
    { date: 'Today (Sept 16)', checkIn: '08:52 AM', checkOut: 'In Progress', totalHours: '7h 45m', status: 'Present' },
    { date: 'Sept 15, 2026', checkIn: '08:45 AM', checkOut: '05:30 PM', totalHours: '8h 45m', status: 'Present' },
    { date: 'Sept 14, 2026', checkIn: '09:02 AM', checkOut: '05:15 PM', totalHours: '8h 13m', status: 'Present' },
    { date: 'Sept 13, 2026', checkIn: '08:50 AM', checkOut: '05:00 PM', totalHours: '8h 10m', status: 'Present' },
    { date: 'Sept 12, 2026', checkIn: '---', checkOut: '---', totalHours: '0h', status: 'Weekend' }
  ];

  const handleToggle = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      addToast('Successfully checked out for today.', 'info');
    } else {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTime(now);
      addToast(`Checked in at ${now}`, 'success');
    }
  };

  return (
    <div className="employee-page-container">
      <div className="emp-metrics-grid">
        <div className="emp-metric-card">
          <div className="metric-icon-box bg-blue">
            <Clock size={22} color="#2563eb" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Status Today</span>
            <h3 className="metric-value">{isCheckedIn ? 'Checked In' : 'Checked Out'}</h3>
            <span className="metric-subtext">Check in time: {checkInTime}</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-green">
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Monthly On-Time Rate</span>
            <h3 className="metric-value">98.5%</h3>
            <span className="metric-subtext">21 Days Present out of 22</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-purple">
            <Calendar size={22} color="#8b5cf6" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Average Working Hours</span>
            <h3 className="metric-value">8h 24m</h3>
            <span className="metric-subtext">Target: 8h 00m per day</span>
          </div>
        </div>
      </div>

      <div className="emp-card" style={{ marginTop: '1.5rem' }}>
        <div className="emp-card-header">
          <h3>Daily Attendance History</h3>
          <button className={`btn ${isCheckedIn ? 'btn-danger' : 'btn-primary'}`} onClick={handleToggle}>
            {isCheckedIn ? <Square size={16} /> : <Play size={16} />}
            <span style={{ marginLeft: '0.4rem' }}>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
          </button>
        </div>
        <div className="emp-card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLog.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{row.date}</td>
                    <td>{row.checkIn}</td>
                    <td>{row.checkOut}</td>
                    <td>{row.totalHours}</td>
                    <td>
                      <span className={`badge ${row.status === 'Present' ? 'badge-success' : 'badge-neutral'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
