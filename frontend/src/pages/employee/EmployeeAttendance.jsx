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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Status Today</span>
            <h3 className="text-lg font-bold text-slate-900">{isCheckedIn ? 'Checked In' : 'Checked Out'}</h3>
            <span className="text-[11px] text-slate-400">Check in time: {checkInTime}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Monthly On-Time Rate</span>
            <h3 className="text-lg font-bold text-slate-900">98.5%</h3>
            <span className="text-[11px] text-slate-400">21 Days Present out of 22</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Average Working Hours</span>
            <h3 className="text-lg font-bold text-slate-900">8h 24m</h3>
            <span className="text-[11px] text-slate-400">Target: 8h 00m per day</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 text-sm">Daily Attendance History</h3>
          <button 
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer ${
              isCheckedIn ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`} 
            onClick={handleToggle}
          >
            {isCheckedIn ? <Square size={16} /> : <Play size={16} />}
            <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Check In</th>
                <th className="px-6 py-3.5">Check Out</th>
                <th className="px-6 py-3.5">Total Hours</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceLog.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-900">{row.date}</td>
                  <td className="px-6 py-3.5 text-slate-600">{row.checkIn}</td>
                  <td className="px-6 py-3.5 text-slate-600">{row.checkOut}</td>
                  <td className="px-6 py-3.5 text-slate-600">{row.totalHours}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      row.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
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
  );
};

export default EmployeeAttendance;
